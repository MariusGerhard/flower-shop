import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  DocumentData,
  Query,
  Unsubscribe,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref } from 'firebase/storage';

import { environment } from '../../../environments/environment';
import { Bouquet, BouquetFilter, BouquetInput } from '../models/bouquet.model';
import { Order } from '../models/order.model';
import { UserModel } from '../models/user.model';
import { UiService } from './ui.service';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  gender: string;
  firstName: string;
  lastName: string;
  birth: Date;
}

const USERS = 'user';
const BOUQUETS = 'bouquets';
const ORDERS = 'order';
const FLOWERS = 'flowers';

/** Live query as Observable. The Firestore document id is put into `id`. */
function watch<T>(q: Query<DocumentData>): Observable<T[]> {
  return new Observable<T[]>((subscriber) => {
    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => subscriber.next(snapshot.docs.map((d) => ({ ...d.data(), id: d.id }) as T)),
      (error) => subscriber.error(error),
    );
    return unsubscribe;
  });
}

/** Wraps the Firebase JS SDK (modular API) for the whole app. */
@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);

  private readonly app = initializeApp(environment.firebase);
  private readonly auth = getAuth(this.app);
  private readonly db = getFirestore(this.app);
  private readonly storage = getStorage(this.app);

  private readonly _authUser = signal<User | null>(null);
  private readonly _profile = signal<UserModel | null>(null);
  private profileUnsubscribe: Unsubscribe | null = null;
  private resolveAuthReady!: () => void;

  /** Logged-in Firebase Auth user (or null). */
  readonly authUser = this._authUser.asReadonly();
  /** User document from the `user` collection for the logged-in user. */
  readonly profile = this._profile.asReadonly();
  readonly isAuth = computed(() => this._authUser() !== null);
  readonly userRole = computed(() => this._profile()?.role ?? null);
  /** Resolves once Firebase has restored (or not) the previous session. */
  readonly authReady = new Promise<void>((resolve) => (this.resolveAuthReady = resolve));

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this._authUser.set(user);
      this.watchProfile(user);
      this.resolveAuthReady();
    });
  }

  // ---------- Auth ----------

  async registerUser(data: RegisterData): Promise<void> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const newUser: UserModel = {
        id: user.uid,
        authId: user.uid,
        gender: data.gender,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        birth: data.birth,
        role: 'user',
        countOrders: 0,
      };
      // The document id is the auth uid, so `id` and `authId` are identical for new users.
      await setDoc(doc(this.db, USERS, user.uid), newUser);
      this.ui.notify('auth.accountCreated');
      await this.router.navigate(['/shop']);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  async loginUser(data: LoginData): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, data.email, data.password);
      const snapshot = await getDocs(query(collection(this.db, USERS), where('authId', '==', user.uid)));
      if (snapshot.empty) {
        await signOut(this.auth);
        this.ui.notify('auth.loginDisabled');
        return;
      }
      this.ui.notify('auth.loginSuccessful');
      await this.router.navigate(['/shop']);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  loginGoogle(): Promise<void> {
    return this.loginWithPopup(new GoogleAuthProvider());
  }

  loginFacebook(): Promise<void> {
    return this.loginWithPopup(new FacebookAuthProvider());
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.ui.notify('auth.resetSent');
      await this.router.navigate(['/login']);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  async logoutUser(): Promise<void> {
    await signOut(this.auth);
    this.ui.notify('auth.logoutSuccessful');
    await this.router.navigate(['']);
  }

  // ---------- Users ----------

  watchUsers(): Observable<UserModel[]> {
    return watch<UserModel>(collection(this.db, USERS));
  }

  updateUser(id: string, value: Partial<UserModel>): Promise<void> {
    return updateDoc(doc(this.db, USERS, id), value);
  }

  deleteUser(id: string): Promise<void> {
    return deleteDoc(doc(this.db, USERS, id));
  }

  // ---------- Bouquets ----------

  watchBouquets(filter?: BouquetFilter | null): Observable<Bouquet[]> {
    const col = collection(this.db, BOUQUETS);
    if (filter?.name) {
      return watch<Bouquet>(query(col, where('name', '>=', filter.name), orderBy('name', 'desc')));
    }
    if (filter?.category) {
      return watch<Bouquet>(query(col, where('category', '==', filter.category), orderBy('name', 'desc')));
    }
    if (filter?.flower) {
      return watch<Bouquet>(query(col, where('flower', '==', filter.flower), orderBy('name', 'desc')));
    }
    return watch<Bouquet>(col);
  }

  addBouquet(data: BouquetInput): Promise<unknown> {
    return addDoc(collection(this.db, BOUQUETS), data);
  }

  updateBouquet(id: string, value: Partial<BouquetInput>): Promise<void> {
    return updateDoc(doc(this.db, BOUQUETS, id), value);
  }

  deleteBouquet(id: string): Promise<void> {
    return deleteDoc(doc(this.db, BOUQUETS, id));
  }

  getPictureUrl(path: string): Promise<string> {
    return getDownloadURL(ref(this.storage, path));
  }

  /** Deletes the bouquet picture in Storage and removes the reference from the bouquet. */
  async deleteBouquetPicture(bouquet: Bouquet): Promise<void> {
    if (bouquet.path) {
      await deleteObject(ref(this.storage, bouquet.path));
    }
    await this.updateBouquet(bouquet.id, { path: null });
  }

  // ---------- Flowers ----------

  watchFlowers(): Observable<{ id: string; name: string; color: string; price: number }[]> {
    return watch(collection(this.db, FLOWERS));
  }

  // ---------- Orders ----------

  watchOrders(): Observable<Order[]> {
    return watch<Order>(query(collection(this.db, ORDERS), orderBy('orderDate', 'desc')));
  }

  watchUserOrders(userId: string): Observable<Order[]> {
    return watch<Order>(
      query(collection(this.db, ORDERS), where('userId', '==', userId), orderBy('orderDate', 'desc')),
    );
  }

  /** Saves the order and increments the order counter of the user. */
  async placeOrder(order: Order): Promise<void> {
    await addDoc(collection(this.db, ORDERS), order);
    await updateDoc(doc(this.db, USERS, order.userId), { countOrders: increment(1) });
  }

  // ---------- internal ----------

  private async loginWithPopup(provider: GoogleAuthProvider | FacebookAuthProvider): Promise<void> {
    try {
      await signInWithPopup(this.auth, provider);
      this.ui.notify('auth.loginSuccessful');
      await this.router.navigate(['/shop']);
    } catch (err) {
      this.handleError(err);
      throw err;
    }
  }

  private watchProfile(user: User | null): void {
    this.profileUnsubscribe?.();
    this.profileUnsubscribe = null;
    this._profile.set(null);
    if (!user) {
      return;
    }
    this.profileUnsubscribe = onSnapshot(
      query(collection(this.db, USERS), where('authId', '==', user.uid)),
      (snapshot) => {
        const d = snapshot.docs[0];
        this._profile.set(d ? ({ ...d.data(), id: d.id } as UserModel) : null);
      },
      (error) => console.error(error),
    );
  }

  private handleError(err: unknown): void {
    this.ui.showError(err);
  }
}
