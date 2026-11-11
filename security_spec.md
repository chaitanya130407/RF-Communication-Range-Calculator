# Security Specification & Test Design: RF Communication Range Calculator

## 1. Data Invariants
1. **User Scoping & Isolation**: All user calculations MUST reside under `/users/{userId}/calculations/{calculationId}` where `{userId} == request.auth.uid`.
2. **Unauthenticated Read/Write Denial**: Any unauthenticated client (`request.auth == null`) attempting any read or write MUST be rejected with `PERMISSION_DENIED`.
3. **Cross-Tenant Isolation**: User A (`auth.uid == 'user_A'`) CANNOT read, create, update, or delete records in `/users/user_B/...`.
4. **Calculations Immutability / Integrity**: Calculations belong strictly to the owner. Deletion of the user root document is denied to preserve structure integrity.
5. **Catch-All Default Deny**: All document paths outside `/users/{userId}` and its subcollections are blocked for all operations (`allow read, write: if false;`).

## 2. The "Dirty Dozen" Test Attack Payloads
1. Unauthenticated read attempt on `/users/alice/calculations/calc1`. (Expect: PERMISSION_DENIED)
2. Unauthenticated write attempt on `/users/alice/calculations/calc1`. (Expect: PERMISSION_DENIED)
3. Bob (`auth.uid == 'bob'`) attempting to read `/users/alice/calculations/calc1`. (Expect: PERMISSION_DENIED)
4. Bob (`auth.uid == 'bob'`) attempting to list `/users/alice/calculations`. (Expect: PERMISSION_DENIED)
5. Bob (`auth.uid == 'bob'`) attempting to add a calculation into `/users/alice/calculations/calc1`. (Expect: PERMISSION_DENIED)
6. Bob (`auth.uid == 'bob'`) attempting to delete `/users/alice/calculations/calc1`. (Expect: PERMISSION_DENIED)
7. Alice attempting to delete her own root document `/users/alice`. (Expect: PERMISSION_DENIED, rule: allow delete: if false)
8. Authenticated user attempting to read arbitrary root doc `/system/config`. (Expect: PERMISSION_DENIED, default deny)
9. Authenticated user attempting to write to unauthorized collection `/global_calculations/calc1`. (Expect: PERMISSION_DENIED)
10. Spoofed client-side query trying to access other users' data without matching path `userId`. (Expect: PERMISSION_DENIED)
11. Bob attempting to update a calculation owned by Alice. (Expect: PERMISSION_DENIED)
12. Malicious actor attempting wildcard traverse `/{document=**}`. (Expect: PERMISSION_DENIED)

## 3. Test Runner Design
Every test checks Firebase Firestore access against mock / live rules to guarantee authorization constraints.
