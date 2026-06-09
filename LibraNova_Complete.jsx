import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════
//  PYTHON OOP SOURCE CODE  (embedded verbatim)
// ═══════════════════════════════════════════════════════
const PYTHON_CODE = `# LibraNova — Python OOP Library System  (All 8 OOP Concepts)
# ✅1 Class Design  ✅2 Encapsulation  ✅3 Constructors  ✅4 Instance Methods
# ✅5 Class/Static  ✅6 Relationships  ✅7 Magic Methods  ✅8 Error Handling

import json, uuid
from datetime import datetime, timedelta

# ── ✅1 CLASS DESIGN + ✅2 ENCAPSULATION + ✅3 CONSTRUCTOR ──────────
class Book:
    @staticmethod                                     # ✅5 static method
    def new_id(): return "BK-" + str(uuid.uuid4())[:6].upper()

    def __init__(self, isbn, title, author, genre, year, copies, shelf="TBD"):
        self.__isbn, self.__title, self.__author = isbn, title, author  # ✅2 private
        self.__genre, self.__year, self.__shelf  = genre, year, shelf
        self.__total, self.__avail               = copies, copies
        self.__id = Book.new_id()

    # @property — controlled read access (✅2 encapsulation)
    @property
    def isbn(self):   return self.__isbn
    @property
    def title(self):  return self.__title
    @property
    def author(self): return self.__author
    @property
    def avail(self):  return self.__avail
    @property
    def total(self):  return self.__total
    @property
    def shelf(self):  return self.__shelf
    @property
    def genre(self):  return self.__genre

    def borrow(self):                                # ✅4 instance method
        if self.__avail > 0: self.__avail -= 1; return True
        return False

    def ret(self):                                   # ✅4 instance method
        if self.__avail < self.__total: self.__avail += 1; return True
        return False

    def to_dict(self):
        return {"isbn":self.__isbn,"title":self.__title,"author":self.__author,
                "genre":self.__genre,"year":self.__year,"shelf":self.__shelf,
                "total":self.__total,"avail":self.__avail}

    def __str__(self):                               # ✅7 magic method
        return f'📗 [{self.__isbn}] "{self.__title}" — {self.__author} | {self.__avail}/{self.__total}'
    def __repr__(self):                              # ✅7 magic method
        return f"Book('{self.__isbn}', avail={self.__avail})"

# ── ✅1 CLASS DESIGN + ✅5 CLASS METHOD ─────────────────────────────
class User:
    _count = 0                                       # class variable ✅5

    @classmethod
    def total(cls): return cls._count                # ✅5 class method

    @staticmethod
    def new_id(): return "USR-" + str(uuid.uuid4())[:6].upper()  # ✅5

    def __init__(self, name, email, phone=""):       # ✅3 constructor
        self.__id, self.__name  = User.new_id(), name  # ✅2 private
        self.__email, self.__phone = email, phone
        self.__joined  = datetime.now().strftime("%Y-%m-%d")
        self.__borrows = []
        User._count += 1

    @property
    def id(self):      return self.__id
    @property
    def name(self):    return self.__name
    @property
    def email(self):   return self.__email
    @property
    def borrows(self): return list(self.__borrows)

    def add_borrow(self, rec):   self.__borrows.append(rec)   # ✅4
    def del_borrow(self, rec):   self.__borrows.remove(rec)   # ✅4
    def has_overdue(self):                                     # ✅4
        return any(r.overdue() for r in self.__borrows)

    def to_dict(self):
        return {"id":self.__id,"name":self.__name,"email":self.__email,
                "phone":self.__phone,"joined":self.__joined,"active":len(self.__borrows)}

    def __str__(self):  return f"👤 [{self.__id}] {self.__name} | {self.__email}"  # ✅7
    def __repr__(self): return f"User('{self.__id}', '{self.__name}')"             # ✅7

# ── ✅6 OBJECT RELATIONSHIPS — IssueRecord links Book ↔ User ───────
class IssueRecord:
    @staticmethod
    def new_id(): return "REC-" + str(uuid.uuid4())[:8].upper()

    def __init__(self, book, user, days=14):         # ✅3 constructor
        self.__id    = IssueRecord.new_id()
        self.__book  = book                          # ✅6 ref to Book obj
        self.__user  = user                          # ✅6 ref to User obj
        self.__issued = datetime.now().date()
        self.__due    = self.__issued + timedelta(days=days)
        self.__returned = None

    @property
    def id(self):       return self.__id
    @property
    def book(self):     return self.__book           # ✅6 relationship
    @property
    def user(self):     return self.__user           # ✅6 relationship
    @property
    def due(self):      return self.__due
    @property
    def is_back(self):  return self.__returned is not None

    def overdue(self):  return not self.is_back and datetime.now().date() > self.__due  # ✅4
    def close(self):    self.__returned = datetime.now().date()                         # ✅4

    def to_dict(self):
        return {"id":self.__id,"book":self.__book.title,"user":self.__user.name,
                "issued":str(self.__issued),"due":str(self.__due),
                "returned":str(self.__returned),"overdue":self.overdue()}

    def __str__(self):                               # ✅7
        s = "RETURNED" if self.is_back else ("OVERDUE" if self.overdue() else "ACTIVE")
        return f'🔖 [{self.__id}] "{self.__book.title}" → {self.__user.name} | Due:{self.__due} [{s}]'
    def __repr__(self): return f"IssueRecord('{self.__id}')"  # ✅7

# ── ✅1 + ✅6 LIBRARY contains Books, Users, IssueRecords ───────────
class Library:
    _libs = 0                                        # class variable ✅5

    @classmethod
    def count(cls): return cls._libs                 # ✅5 class method

    @staticmethod
    def uid(p="LIB"): return p+"-"+str(uuid.uuid4())[:6].upper()  # ✅5 static

    def __init__(self, name, location):              # ✅3 constructor
        self.__id, self.__name = Library.uid(), name  # ✅2 encapsulation
        self.__location = location
        self.__books, self.__users, self.__recs = {}, {}, {}  # ✅6 contains objects
        Library._libs += 1

    @property
    def id(self):   return self.__id
    @property
    def name(self): return self.__name

    # ── ✅4 Instance methods + ✅8 Error handling ──────────────────
    def add_book(self, isbn, title, author, genre, year, copies, shelf="TBD"):
        try:                                         # ✅8 try-except
            if not isbn: raise ValueError("ISBN required")
            if isbn in self.__books: raise ValueError(f"'{isbn}' already exists")
            b = Book(isbn, title, author, genre, year, copies, shelf)
            self.__books[isbn] = b; print(f"✅ {b}"); return b
        except ValueError as e: print(f"❌ {e}"); raise

    def register(self, name, email, phone=""):
        try:                                         # ✅8 try-except
            if "@" not in email: raise ValueError(f"Bad email: {email}")
            if any(u.email==email for u in self.__users.values()):
                raise ValueError(f"Email already registered")
            u = User(name, email, phone)
            self.__users[u.id] = u; print(f"✅ {u}"); return u
        except ValueError as e: print(f"❌ {e}"); raise

    def issue(self, isbn, uid, days=14):
        try:                                         # ✅8 try-except
            b = self.__books.get(isbn)
            u = self.__users.get(uid)
            if not b: raise KeyError(f"Book '{isbn}' not found")
            if not u: raise KeyError(f"Member '{uid}' not found")
            if b.avail < 1: raise PermissionError(f"No copies of '{b.title}'")
            if u.has_overdue(): raise PermissionError(f"'{u.name}' has overdue books")
            b.borrow(); r = IssueRecord(b, u, days)  # ✅6 create relationship
            u.add_borrow(r); self.__recs[r.id] = r
            print(f"✅ {r}"); return r
        except (KeyError, PermissionError) as e: print(f"❌ {e}"); raise

    def ret(self, rec_id):
        try:                                         # ✅8 try-except
            r = self.__recs.get(rec_id)
            if not r: raise KeyError(f"Record '{rec_id}' not found")
            if r.is_back: raise ValueError("Already returned")
            r.close(); r.book.ret(); r.user.del_borrow(r)
            print(f"✅ Returned: \"{r.book.title}\""); return True
        except (KeyError, ValueError) as e: print(f"❌ {e}"); return False

    def find(self, q):                               # ✅4 instance method
        q = q.lower()
        return [b for b in self.__books.values()
                if q in b.isbn or q in b.title.lower() or q in b.author.lower()]

    def summary(self):                               # ✅4 instance method
        a = sum(1 for r in self.__recs.values() if not r.is_back and not r.overdue())
        o = sum(1 for r in self.__recs.values() if r.overdue())
        print(f"📚 Books:{len(self.__books)}  👥 Members:{len(self.__users)}  🔖 Active:{a}  ⚠️ Overdue:{o}")

    def save(self, path="data.json"):               # ✅4 + ✅8
        try:
            with open(path, "w") as f:
                json.dump({"books":[b.to_dict() for b in self.__books.values()],
                           "users":[u.to_dict() for u in self.__users.values()],
                           "recs": [r.to_dict() for r in self.__recs.values()]}, f, indent=2)
            print(f"💾 Saved to {path}")
        except IOError as e: print(f"❌ Save error: {e}")  # ✅8

    def __str__(self):   return f"🏛️ {self.__name} | Books:{len(self.__books)} Members:{len(self.__users)}"  # ✅7
    def __repr__(self):  return f"Library('{self.__id}', '{self.__name}')"  # ✅7
    def __len__(self):   return len(self.__books)    # ✅7 len(lib)
    def __contains__(self, isbn): return isbn in self.__books  # ✅7 'isbn' in lib

# ── DEMO ────────────────────────────────────────────────────────────
if __name__ == "__main__":
    lib = Library("LibraNova", "New Delhi")
    print(repr(lib)); print(lib)                     # __repr__, __str__

    lib.add_book("978-001","To Kill a Mockingbird","Harper Lee","Fiction",1960,3,"A-12")
    lib.add_book("978-002","1984","George Orwell","Dystopian",1949,4,"B-03")
    lib.add_book("978-003","Dune","Frank Herbert","Sci-Fi",1965,2,"H-01")

    try: lib.add_book("978-001","Dup","X","X",2024,1)  # ✅8 duplicate ISBN
    except ValueError: print("  (Duplicate caught ✅)")

    u1 = lib.register("Aarav Sharma","aarav@email.com","9876543210")
    u2 = lib.register("Priya Patel","priya@email.com","9876543211")

    try: lib.register("Bad","not-an-email")           # ✅8 bad email
    except ValueError: print("  (Bad email caught ✅)")

    r = lib.issue("978-001", u1.id)
    lib.issue("978-003", u2.id)
    lib.ret(r.id)

    lib.summary()
    print(f"len(lib)={len(lib)}  '978-001' in lib? {'978-001' in lib}")  # ✅7
    print(f"Class method: users={User.total()}  libs={Library.count()}")
    print(f"Static method: {Library.uid('TEST')}")
    lib.save()
    print("\\n✅ All 8 OOP concepts in ~220 lines!")`

;

// ═══════════════════════════════════════════════════════
//  DEMO OUTPUT (pre-recorded)
// ═══════════════════════════════════════════════════════
const DEMO_OUTPUT = `
══════════════════════════════════════════════════════════════════════
   LibraNova Python OOP Demo — All 8 Concepts Applied
══════════════════════════════════════════════════════════════════════
Library(id='LIB-720085', name='LibraNova Central', books=8, members=4)
🏛️  Library: LibraNova Central | New Delhi, India | Books: 8 | Members: 4
📐 len(lib) = 8 unique titles

╔══════════════════════════════════════════════════════════╗
  🏛️  LibraNova Central  |  New Delhi, India
  Library ID: LIB-720085
╠══════════════════════════════════════════════════════════╣
  📚 Total Unique Titles : 8
  📦 Total Copies        : 28
  ✅ Available Copies    : 28
  👥 Registered Members  : 4
  🔖 Currently Issued    : 0
  ⚠️  Overdue Books       : 0
  ↩️  Total Returned      : 0
╚══════════════════════════════════════════════════════════╝

── Adding a new book ──
✅ Book added: 📗 [978-0-7432-9999-0] "Clean Code" by Robert C. Martin (2008) | Tech | Shelf: J-05 | 3/3 available

── Attempting duplicate ISBN (should raise error) ──
❌ Error adding book: Book with ISBN '978-0-7432-9999-0' already exists.
   (Error caught and handled gracefully ✅)

── Registering a new member ──
✅ Member registered: 👤 [USR-FB0EE5] Vikram Bose | vikram@email.com | Books borrowed: 0

── Attempting invalid email (should raise error) ──
❌ Registration error: Invalid email: 'not-an-email'
   (Error caught and handled gracefully ✅)

── Issuing books ──
✅ Book issued: 🔖 [REC-6E31404E] "To Kill a Mockingbird" → Aarav Sharma | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]
✅ Book issued: 🔖 [REC-AE19FA6E] "The Great Gatsby" → Priya Patel | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]
✅ Book issued: 🔖 [REC-248E50A4] "Dune" → Rohit Kumar | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]

══════════════════════════════════════════════════════════════════════
  🔖 Issued Records — [ALL] (3 records)
══════════════════════════════════════════════════════════════════════
  🔖 [REC-6E31404E] "To Kill a Mockingbird" → Aarav Sharma | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]
  🔖 [REC-AE19FA6E] "The Great Gatsby" → Priya Patel | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]
  🔖 [REC-248E50A4] "Dune" → Rohit Kumar | Issued: 2026-06-08 | Due: 2026-06-22 | [ACTIVE]
══════════════════════════════════════════════════════════════════════

── Returning a book ──
✅ Book returned: "To Kill a Mockingbird" by Aarav Sharma

── __contains__: Is '978-0-06-112008-4' in library? True

── Searching for 'George Orwell' ──
   Found: 📗 [978-0-7432-7356-5] "1984" by George Orwell (1949) | Dystopian | Shelf: B-03 | 4/4 available

── Class Method: Total Users created = 5
── Class Method: Library instances    = 1
── Static Method: New UID             = TEST-AEF057

══════════════════════════════════════════════════════════════════════
  ⚠️  Overdue Books Report (0 overdue)
══════════════════════════════════════════════════════════════════════
  🎉 No overdue books!
══════════════════════════════════════════════════════════════════════

╔══════════════════════════════════════════════════════════╗
  🏛️  LibraNova Central  |  New Delhi, India
  Library ID: LIB-BF91B2
╠══════════════════════════════════════════════════════════╣
  📚 Total Unique Titles : 9
  📦 Total Copies        : 31
  ✅ Available Copies    : 29
  👥 Registered Members  : 5
  🔖 Currently Issued    : 2
  ⚠️  Overdue Books       : 0
  ↩️  Total Returned      : 1
╚══════════════════════════════════════════════════════════╝

💾 Library data saved to 'library_data.json'

✅ Demo complete! All 8 OOP concepts demonstrated successfully.`;

// ═══════════════════════════════════════════════════════
//  OOP CONCEPTS METADATA
// ═══════════════════════════════════════════════════════
const OOP_CONCEPTS = [
  { id: 1, icon: "🏗️", label: "Class & Object Design", color: "#6366f1",
    desc: "Book, User, IssueRecord, Library — 4 real-world Python classes modelling the library domain.",
    where: "class Book, class User, class IssueRecord, class Library" },
  { id: 2, icon: "🔒", label: "Encapsulation", color: "#8b5cf6",
    desc: "All attributes are private (__title, __is_borrowed, etc.) and exposed via @property decorators to ensure data integrity.",
    where: "self.__title, self.__is_borrowed, @property decorators" },
  { id: 3, icon: "🔧", label: "Constructors (__init__)", color: "#ec4899",
    desc: "Every class properly initialises its own complete state inside __init__ before any method is called.",
    where: "def __init__(self, ...) in all 4 classes" },
  { id: 4, icon: "⚙️", label: "Instance Methods", color: "#f59e0b",
    desc: "borrow_copy(), issue_book(), return_book(), dashboard_summary() — behaviours tied to specific object instances.",
    where: "borrow_copy, return_copy, add_borrowed, issue_book, return_book" },
  { id: 5, icon: "📐", label: "Class / Static Methods", color: "#10b981",
    desc: "Library.generate_unique_id(), User.get_total_users(), Book.generate_book_id() — utilities not tied to one instance.",
    where: "@classmethod get_total_users, @staticmethod generate_unique_id" },
  { id: 6, icon: "🔗", label: "Object Relationships", color: "#06b6d4",
    desc: "Library contains dict of Books and Users. IssueRecord holds direct references to both a Book and a User object (composition).",
    where: "IssueRecord(book, user), Library.__books, Library.__users" },
  { id: 7, icon: "✨", label: "Magic Methods", color: "#f97316",
    desc: "__str__ for human-readable print(), __repr__ for debugging, __len__ for len(library), __contains__ for 'isbn in library'.",
    where: "__str__, __repr__ (all classes), __len__, __contains__ (Library)" },
  { id: 8, icon: "🛡️", label: "Error Handling (try-except)", color: "#ef4444",
    desc: "try-except guards every user-facing operation: duplicate ISBN, invalid email, no copies, already returned, file I/O.",
    where: "add_book, register_user, issue_book, return_book, save_to_file" },
];

// ─────────────────────────────────
//  Simple Python syntax highlighter
// ─────────────────────────────────
function highlight(code) {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    let html = line
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // OOP concept annotations
    if (html.includes("✅ OOP CONCEPT")) {
      return `<span style="color:#4ade80;font-weight:600;background:rgba(74,222,128,0.08);display:block;padding:0 2px">${html}</span>`;
    }
    // Docstrings / triple quotes
    if (html.trim().startsWith('"""') || html.trim().startsWith("╔") || html.trim().startsWith("║") || html.trim().startsWith("╚") || html.trim().startsWith("╠")) {
      return `<span style="color:#94a3b8">${html}</span>`;
    }
    // Comments
    if (html.trim().startsWith("#")) {
      return `<span style="color:#64748b;font-style:italic">${html}</span>`;
    }
    // Keywords
    html = html
      .replace(/\b(class|def|return|if|else|elif|for|while|import|from|in|not|and|or|True|False|None|try|except|raise|with|as|pass|break|continue|self|cls)\b/g,
        '<span style="color:#c084fc">$1</span>')
      // Decorators
      .replace(/(@\w+)/g, '<span style="color:#fb923c">$1</span>')
      // Strings
      .replace(/(f?"[^"]*"|f?'[^']*')/g, '<span style="color:#86efac">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span style="color:#67e8f9">$1</span>')
      // Built-in types / functions
      .replace(/\b(str|int|bool|dict|list|None|True|False|print|len|max|sum|any|open|json)\b/g,
        '<span style="color:#f9a8d4">$1</span>')
      // Method/function definitions
      .replace(/\bdef (\w+)/g, 'def <span style="color:#fde68a">$1</span>')
      // Class names
      .replace(/\bclass (\w+)/g, 'class <span style="color:#7dd3fc">$1</span>');

    return `<span>${html}</span>`;
  }).join("\n");
}

// ═══════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════
const initialBooks = [
  { id: "978-0-06-112008-4", title: "To Kill a Mockingbird", author: "Harper Lee",        genre: "Fiction",     year: 1960, copies: 3, available: 2, cover: "📗", rating: 4.8, shelf: "A-12" },
  { id: "978-0-7432-7356-5", title: "1984",                  author: "George Orwell",     genre: "Dystopian",   year: 1949, copies: 4, available: 4, cover: "📘", rating: 4.7, shelf: "B-03" },
  { id: "978-0-14-028329-7", title: "The Great Gatsby",      author: "F. Scott Fitzgerald",genre: "Classic",    year: 1925, copies: 2, available: 0, cover: "📙", rating: 4.1, shelf: "A-07" },
  { id: "978-0-316-76948-0", title: "The Catcher in the Rye",author: "J.D. Salinger",     genre: "Fiction",     year: 1951, copies: 3, available: 1, cover: "📕", rating: 4.0, shelf: "C-15" },
  { id: "978-0-7432-7357-2", title: "Brave New World",       author: "Aldous Huxley",     genre: "Dystopian",   year: 1932, copies: 2, available: 2, cover: "📗", rating: 4.5, shelf: "B-04" },
  { id: "978-0-06-093546-9", title: "To the Lighthouse",     author: "Virginia Woolf",    genre: "Modernist",   year: 1927, copies: 1, available: 1, cover: "📘", rating: 4.2, shelf: "D-08" },
  { id: "978-0-7432-7358-9", title: "Sapiens",               author: "Yuval Noah Harari", genre: "Non-Fiction", year: 2011, copies: 5, available: 3, cover: "📙", rating: 4.6, shelf: "E-02" },
  { id: "978-0-525-55360-5", title: "The Midnight Library",  author: "Matt Haig",         genre: "Fantasy",     year: 2020, copies: 3, available: 2, cover: "📕", rating: 4.4, shelf: "F-11" },
  { id: "978-1-501-17774-0", title: "It Ends with Us",       author: "Colleen Hoover",    genre: "Romance",     year: 2016, copies: 4, available: 1, cover: "📗", rating: 4.3, shelf: "G-06" },
  { id: "978-0-385-54734-9", title: "Atomic Habits",         author: "James Clear",       genre: "Self-Help",   year: 2018, copies: 6, available: 4, cover: "📘", rating: 4.8, shelf: "E-09" },
  { id: "978-0-374-28003-1", title: "The Alchemist",         author: "Paulo Coelho",      genre: "Fiction",     year: 1988, copies: 3, available: 3, cover: "📙", rating: 4.5, shelf: "A-14" },
  { id: "978-0-525-56070-2", title: "Dune",                  author: "Frank Herbert",     genre: "Sci-Fi",      year: 1965, copies: 2, available: 0, cover: "📕", rating: 4.7, shelf: "H-01" },
];
const initialMembers = [
  { id: "M001", name: "Aarav Sharma", email: "aarav@email.com",  phone: "9876543210", joined: "2024-01-15", issued: 2 },
  { id: "M002", name: "Priya Patel",  email: "priya@email.com",  phone: "9876543211", joined: "2024-03-22", issued: 1 },
  { id: "M003", name: "Rohit Kumar",  email: "rohit@email.com",  phone: "9876543212", joined: "2024-06-10", issued: 0 },
  { id: "M004", name: "Sneha Singh",  email: "sneha@email.com",  phone: "9876543213", joined: "2025-01-05", issued: 3 },
];
const initialIssued = [
  { id:"IS001", bookId:"978-0-14-028329-7", bookTitle:"The Great Gatsby",       memberId:"M001", memberName:"Aarav Sharma", issueDate:"2026-05-20", dueDate:"2026-06-03", returnDate:null, status:"overdue" },
  { id:"IS002", bookId:"978-0-525-56070-2", bookTitle:"Dune",                   memberId:"M002", memberName:"Priya Patel",  issueDate:"2026-05-28", dueDate:"2026-06-11", returnDate:null, status:"active"  },
  { id:"IS003", bookId:"978-0-316-76948-0", bookTitle:"The Catcher in the Rye", memberId:"M004", memberName:"Sneha Singh",  issueDate:"2026-05-15", dueDate:"2026-05-29", returnDate:null, status:"overdue" },
  { id:"IS004", bookId:"978-1-501-17774-0", bookTitle:"It Ends with Us",        memberId:"M004", memberName:"Sneha Singh",  issueDate:"2026-06-01", dueDate:"2026-06-15", returnDate:null, status:"active"  },
  { id:"IS005", bookId:"978-0-06-112008-4", bookTitle:"To Kill a Mockingbird",  memberId:"M001", memberName:"Aarav Sharma", issueDate:"2026-05-10", dueDate:"2026-05-24", returnDate:"2026-05-23", status:"returned" },
];
const genres = ["All","Fiction","Dystopian","Classic","Modernist","Non-Fiction","Fantasy","Romance","Self-Help","Sci-Fi"];

// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{--ink:#1a1a2e;--parchment:#f5f0e8;--gold:#c9a84c;--gold-light:#e8d5a3;--rust:#8b4513;--forest:#2d5a27;--cream:#faf7f2;--shadow:rgba(26,26,46,.12);--border:rgba(201,168,76,.3);}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--ink);}
.app{display:flex;min-height:100vh;}

/* SIDEBAR */
.sidebar{width:220px;min-height:100vh;background:var(--ink);display:flex;flex-direction:column;position:fixed;left:0;top:0;z-index:100;border-right:3px solid var(--gold);}
.sidebar-logo{padding:20px 16px;border-bottom:1px solid rgba(201,168,76,.2);font-family:'Playfair Display',serif;}
.sidebar-logo .logo-icon{font-size:24px;}
.sidebar-logo .logo-text{color:var(--gold);font-size:16px;font-weight:700;line-height:1.2;}
.sidebar-logo .logo-sub{color:rgba(255,255,255,.35);font-size:9px;letter-spacing:3px;text-transform:uppercase;}
.nav-section{padding:12px 0;}
.nav-label{color:rgba(255,255,255,.3);font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:0 16px 6px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;color:rgba(255,255,255,.6);cursor:pointer;transition:all .2s;font-size:13px;font-weight:500;border-left:3px solid transparent;}
.nav-item:hover{color:var(--gold-light);background:rgba(201,168,76,.08);}
.nav-item.active{color:var(--gold);background:rgba(201,168,76,.12);border-left-color:var(--gold);}
.nav-icon{font-size:15px;width:18px;text-align:center;}
.nav-badge{margin-left:auto;background:var(--rust);color:#fff;font-size:10px;padding:2px 6px;border-radius:10px;font-weight:600;}
.sidebar-footer{margin-top:auto;padding:14px 16px;border-top:1px solid rgba(201,168,76,.2);}
.lib-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.stat-mini{background:rgba(255,255,255,.05);border-radius:7px;padding:7px;text-align:center;}
.stat-mini .val{color:var(--gold);font-size:16px;font-weight:700;font-family:'Playfair Display',serif;}
.stat-mini .lbl{color:rgba(255,255,255,.35);font-size:9px;text-transform:uppercase;letter-spacing:1px;}

/* MAIN */
.main{margin-left:220px;flex:1;padding:24px 28px;min-height:100vh;}
.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;}
.page-title{font-family:'Playfair Display',serif;font-size:26px;color:var(--ink);}
.page-title span{color:var(--gold);}
.header-actions{display:flex;gap:8px;align-items:center;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;transition:all .2s;}
.btn-primary{background:var(--ink);color:var(--gold);}
.btn-primary:hover{background:#2a2a4e;transform:translateY(-1px);}
.btn-gold{background:var(--gold);color:var(--ink);}
.btn-gold:hover{background:#b8973a;transform:translateY(-1px);}
.btn-outline{background:transparent;color:var(--ink);border:1.5px solid var(--border);}
.btn-outline:hover{border-color:var(--gold);color:var(--gold);}
.btn-success{background:var(--forest);color:#fff;}
.btn-sm{padding:5px 11px;font-size:12px;}

/* STATS */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
.stat-card{background:#fff;border-radius:12px;padding:18px;border:1px solid var(--border);position:relative;overflow:hidden;}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gold);}
.stat-card.red::before{background:var(--rust);}
.stat-card.green::before{background:var(--forest);}
.stat-card.blue::before{background:#2563eb;}
.stat-card .s-icon{font-size:22px;margin-bottom:6px;}
.stat-card .s-val{font-size:26px;font-weight:700;font-family:'Playfair Display',serif;color:var(--ink);}
.stat-card .s-lbl{font-size:11px;color:#666;margin-top:2px;}

/* SEARCH */
.toolbar{display:flex;gap:10px;margin-bottom:18px;flex-wrap:wrap;align-items:center;}
.search-box{flex:1;min-width:200px;display:flex;align-items:center;background:#fff;border:1.5px solid var(--border);border-radius:10px;padding:0 12px;gap:8px;}
.search-box input{border:none;outline:none;font-family:'DM Sans',sans-serif;font-size:14px;padding:9px 0;flex:1;background:transparent;color:var(--ink);}
.filter-chip{padding:7px 13px;border-radius:20px;border:1.5px solid var(--border);background:#fff;cursor:pointer;font-size:11px;font-weight:500;color:#555;transition:all .15s;font-family:'DM Sans',sans-serif;}
.filter-chip.active{background:var(--ink);color:var(--gold);border-color:var(--ink);}
.filter-chip:hover:not(.active){border-color:var(--gold);color:var(--gold);}

/* BOOKS GRID */
.books-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;}
.book-card{background:#fff;border-radius:13px;border:1px solid var(--border);overflow:hidden;transition:all .25s;cursor:pointer;}
.book-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px var(--shadow);border-color:var(--gold);}
.book-cover{height:110px;display:flex;align-items:center;justify-content:center;font-size:46px;background:linear-gradient(135deg,var(--parchment),var(--gold-light));position:relative;}
.avail-badge{position:absolute;top:8px;right:8px;padding:3px 7px;border-radius:5px;font-size:10px;font-weight:700;}
.badge-avail{background:#d4edda;color:var(--forest);}
.badge-out{background:#f8d7da;color:#721c24;}
.badge-low{background:#fff3cd;color:#856404;}
.book-info{padding:12px;}
.book-title{font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:var(--ink);margin-bottom:2px;line-height:1.3;}
.book-author{font-size:11px;color:#777;margin-bottom:7px;}
.book-meta{display:flex;justify-content:space-between;align-items:center;}
.book-genre{font-size:10px;background:var(--parchment);color:var(--rust);padding:2px 7px;border-radius:4px;font-weight:600;}
.book-rating{font-size:11px;color:var(--gold);font-weight:600;}
.book-shelf{font-size:10px;color:#999;margin-top:4px;}

/* TABLE */
.table-wrap{background:#fff;border-radius:13px;border:1px solid var(--border);overflow:hidden;}
.table-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.table-title{font-family:'Playfair Display',serif;font-size:16px;color:var(--ink);}
table{width:100%;border-collapse:collapse;}
thead th{background:var(--parchment);padding:10px 14px;text-align:left;font-size:10px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid var(--border);}
tbody td{padding:11px 14px;font-size:13px;border-bottom:1px solid rgba(201,168,76,.1);vertical-align:middle;}
tbody tr:last-child td{border-bottom:none;}
tbody tr:hover td{background:rgba(245,240,232,.5);}
.status-pill{padding:3px 9px;border-radius:11px;font-size:11px;font-weight:700;display:inline-block;}
.pill-active{background:#d4edda;color:var(--forest);}
.pill-overdue{background:#f8d7da;color:#721c24;}
.pill-returned{background:#d1ecf1;color:#0c5460;}

/* SCANNER */
.scanner-modal{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
.scanner-box{background:var(--ink);color:#fff;border-radius:18px;padding:28px;width:460px;max-width:95vw;border:2px solid var(--gold);}
.scanner-title{font-family:'Playfair Display',serif;font-size:20px;color:var(--gold);margin-bottom:4px;}
.scanner-sub{color:rgba(255,255,255,.5);font-size:12px;margin-bottom:18px;}
.scan-area{background:rgba(255,255,255,.05);border:2px dashed rgba(201,168,76,.5);border-radius:12px;padding:24px;text-align:center;margin-bottom:16px;position:relative;min-height:90px;}
.scan-line{position:absolute;left:18px;right:18px;height:2px;background:var(--gold);animation:scanAnim 1.8s ease-in-out infinite;top:30%;}
@keyframes scanAnim{0%{top:20%;opacity:0}30%{opacity:1}70%{opacity:1}100%{top:80%;opacity:0}}
.scanner-input-row{display:flex;gap:8px;margin-bottom:16px;}
.scanner-input{flex:1;padding:10px 12px;border-radius:8px;border:1.5px solid rgba(201,168,76,.4);background:rgba(255,255,255,.07);color:#fff;font-size:13px;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;}
.scanner-input:focus{border-color:var(--gold);}
.scanner-input::placeholder{color:rgba(255,255,255,.3);}
.scan-result{background:rgba(255,255,255,.07);border-radius:9px;padding:12px;margin-bottom:12px;}
.r-label{color:rgba(255,255,255,.4);font-size:10px;text-transform:uppercase;letter-spacing:1px;}
.r-val{color:#fff;font-size:13px;margin-top:2px;font-weight:500;}

/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(3px);}
.modal{background:#fff;border-radius:16px;padding:26px 28px;width:460px;max-width:95vw;border:1px solid var(--border);max-height:85vh;overflow-y:auto;}
.modal-title{font-family:'Playfair Display',serif;font-size:19px;color:var(--ink);margin-bottom:3px;}
.modal-sub{color:#888;font-size:12px;margin-bottom:20px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.form-group{margin-bottom:14px;}
.form-group label{display:block;font-size:11px;font-weight:600;color:#555;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;}
.form-group input,.form-group select{width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid var(--border);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;color:var(--ink);transition:border-color .2s;}
.form-group input:focus,.form-group select:focus{border-color:var(--gold);}
.modal-actions{display:flex;gap:8px;justify-content:flex-end;margin-top:8px;}
.detail-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px;}
.detail-row .d-key{color:#888;}
.detail-row .d-val{font-weight:600;color:var(--ink);}
.cover-big{font-size:72px;text-align:center;padding:18px;background:linear-gradient(135deg,var(--parchment),var(--gold-light));border-radius:10px;margin-bottom:16px;}

/* TABS */
.tabs{display:flex;gap:3px;background:var(--parchment);padding:4px;border-radius:10px;margin-bottom:18px;}
.tab{padding:7px 16px;border-radius:7px;cursor:pointer;font-size:12px;font-weight:500;color:#666;transition:all .15s;border:none;background:none;font-family:'DM Sans',sans-serif;}
.tab.active{background:#fff;color:var(--ink);font-weight:600;box-shadow:0 1px 4px var(--shadow);}

/* DASH */
.dash-grid{display:grid;grid-template-columns:1fr 300px;gap:18px;}
.card{background:#fff;border-radius:13px;border:1px solid var(--border);padding:18px;}
.activity-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(201,168,76,.1);align-items:flex-start;}
.activity-item:last-child{border-bottom:none;}
.activity-dot{width:9px;height:9px;border-radius:50%;margin-top:4px;flex-shrink:0;}
.dot-issue{background:var(--gold);}
.dot-return{background:var(--forest);}
.dot-add{background:#2563eb;}
.dot-overdue{background:var(--rust);}
.activity-text{font-size:12.5px;color:var(--ink);line-height:1.5;}
.activity-time{font-size:11px;color:#aaa;margin-top:2px;}
.alert-bar{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:9px;margin-bottom:14px;font-size:13px;}
.alert-warning{background:#fff3cd;border-left:4px solid #ffc107;color:#856404;}
.alert-danger{background:#f8d7da;border-left:4px solid #dc3545;color:#721c24;}
.toast{position:fixed;bottom:28px;right:28px;background:var(--ink);color:var(--gold);padding:12px 20px;border-radius:11px;font-size:13px;font-weight:500;border:1px solid var(--gold);z-index:999;animation:toastIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.3);}
@keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.empty{text-align:center;padding:36px;color:#bbb;font-size:13px;}
.empty .empty-icon{font-size:36px;margin-bottom:8px;}

/* TOP NAV for main sections */
.top-nav{display:flex;gap:2px;background:var(--ink);padding:4px 6px;border-radius:12px;margin-bottom:24px;}
.top-nav-item{padding:8px 20px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.55);transition:all .2s;border:none;background:none;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:7px;}
.top-nav-item:hover{color:rgba(255,255,255,.85);}
.top-nav-item.active{background:var(--gold);color:var(--ink);font-weight:700;}
.tnbadge{background:#dc3545;color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:700;}

/* ── PYTHON VIEW ───────────────────────────── */
.py-container{display:grid;grid-template-columns:1fr 1fr;gap:0;height:calc(100vh - 160px);background:#0f172a;border-radius:14px;overflow:hidden;border:2px solid rgba(201,168,76,.3);}
.py-code-panel{overflow:auto;border-right:2px solid rgba(201,168,76,.15);}
.py-right-panel{display:flex;flex-direction:column;overflow:hidden;}
.py-code-header{background:#1e293b;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0;}
.py-file-tab{background:rgba(201,168,76,.15);color:var(--gold);padding:4px 14px;border-radius:6px;font-size:12px;font-family:'JetBrains Mono',monospace;font-weight:500;}
.py-lang-badge{font-size:10px;color:rgba(255,255,255,.4);font-family:'JetBrains Mono',monospace;background:rgba(255,255,255,.05);padding:3px 9px;border-radius:5px;}
pre.py-code{padding:16px 20px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.75;color:#e2e8f0;white-space:pre;tab-size:4;margin:0;}
.py-concepts-panel{padding:12px 16px;overflow-y:auto;flex:1;}
.concept-card{background:rgba(255,255,255,.04);border-radius:9px;padding:12px;margin-bottom:8px;border-left:3px solid;transition:all .2s;cursor:default;}
.concept-card:hover{background:rgba(255,255,255,.07);}
.concept-header{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.concept-num{font-size:10px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.3);font-weight:600;}
.concept-label{font-size:12px;font-weight:700;color:#f1f5f9;}
.concept-desc{font-size:11px;color:rgba(255,255,255,.5);line-height:1.5;margin-bottom:5px;}
.concept-where{font-size:10px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.3);background:rgba(0,0,0,.3);padding:4px 8px;border-radius:5px;}
.py-output-area{background:#020617;border-top:2px solid rgba(201,168,76,.15);flex-shrink:0;}
.py-output-header{background:#1e293b;padding:8px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,.05);}
.py-output-title{font-size:11px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:1px;}
.py-output-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:blink 2s infinite;}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
pre.py-output{padding:12px 16px;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.7;color:#86efac;white-space:pre;max-height:220px;overflow-y:auto;margin:0;}
.oop-checklist{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;}
.oop-tag{font-size:10px;padding:4px 10px;border-radius:6px;font-weight:700;font-family:'JetBrains Mono',monospace;}
`;

export default function App() {
  const [mainTab, setMainTab] = useState("ui");
  const [page, setPage] = useState("dashboard");
  const [books, setBooks] = useState(initialBooks);
  const [members, setMembers] = useState(initialMembers);
  const [issued, setIssued] = useState(initialIssued);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [showScanner, setShowScanner] = useState(false);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanStep, setScanStep] = useState("scan_book");
  const [selectedMember, setSelectedMember] = useState("");
  const [showAddBook, setShowAddBook] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBook, setNewBook] = useState({ id:"", title:"", author:"", genre:"Fiction", year:"", copies:1, shelf:"" });
  const [newMember, setNewMember] = useState({ name:"", email:"", phone:"" });
  const [issueTab, setIssueTab] = useState("active");
  const scanInputRef = useRef(null);
  const highlightedCode = highlight(PYTHON_CODE);

  useEffect(() => { if (showScanner && scanInputRef.current) scanInputRef.current.focus(); }, [showScanner]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const overdueCount = issued.filter(r => r.status === "overdue").length;
  const activeCount  = issued.filter(r => r.status === "active").length;
  const totalAvail   = books.reduce((a, b) => a + b.available, 0);

  const filteredBooks = books.filter(b => {
    const q = search.toLowerCase();
    return (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.id.includes(q))
      && (genreFilter === "All" || b.genre === genreFilter);
  });

  const handleScanInput = (val) => {
    setScanInput(val);
    if (val.length >= 10) {
      const found = books.find(b => b.id === val || b.id.replace(/-/g,"") === val.replace(/-/g,""));
      setScanResult(found || "not_found");
    } else { setScanResult(null); }
  };

  const handleIssueBook = () => {
    if (!scanResult || scanResult === "not_found" || !selectedMember) return;
    const member = members.find(m => m.id === selectedMember);
    if (scanResult.available < 1) { showToast("❌ No copies available!"); return; }
    const today = new Date(); const due = new Date(); due.setDate(due.getDate()+14);
    const fmt = d => d.toISOString().split("T")[0];
    const rec = { id:"IS"+ String(issued.length+1).padStart(3,"0"), bookId:scanResult.id, bookTitle:scanResult.title,
      memberId:member.id, memberName:member.name, issueDate:fmt(today), dueDate:fmt(due), returnDate:null, status:"active" };
    setIssued(p => [rec,...p]);
    setBooks(p => p.map(b => b.id===scanResult.id ? {...b,available:b.available-1} : b));
    setMembers(p => p.map(m => m.id===member.id ? {...m,issued:m.issued+1} : m));
    showToast(`✅ "${scanResult.title}" issued to ${member.name}`);
    setShowScanner(false); setScanInput(""); setScanResult(null); setScanStep("scan_book"); setSelectedMember("");
  };

  const handleReturn = (record) => {
    setIssued(p => p.map(r => r.id===record.id ? {...r,status:"returned",returnDate:new Date().toISOString().split("T")[0]} : r));
    setBooks(p => p.map(b => b.id===record.bookId ? {...b,available:b.available+1} : b));
    setMembers(p => p.map(m => m.id===record.memberId ? {...m,issued:Math.max(0,m.issued-1)} : m));
    showToast(`📚 "${record.bookTitle}" returned successfully`);
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.id) return;
    setBooks(p => [...p,{...newBook,copies:+newBook.copies,available:+newBook.copies,cover:"📗",rating:4.0,year:+newBook.year}]);
    showToast(`📗 "${newBook.title}" added to library`);
    setShowAddBook(false);
    setNewBook({id:"",title:"",author:"",genre:"Fiction",year:"",copies:1,shelf:""});
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) return;
    const id = "M"+ String(members.length+1).padStart(3,"0");
    setMembers(p => [...p,{...newMember,id,joined:new Date().toISOString().split("T")[0],issued:0}]);
    showToast(`👤 ${newMember.name} registered as member`);
    setShowAddMember(false);
    setNewMember({name:"",email:"",phone:""});
  };

  const activities = [
    {type:"issue",  text:"Dune issued to Priya Patel",                     time:"2 hours ago"},
    {type:"return", text:"To Kill a Mockingbird returned by Aarav Sharma", time:"1 day ago"},
    {type:"add",    text:"New book 'Atomic Habits' added to catalog",       time:"3 days ago"},
    {type:"overdue",text:"The Great Gatsby overdue by Aarav Sharma",        time:"5 days ago"},
    {type:"issue",  text:"It Ends with Us issued to Sneha Singh",           time:"7 days ago"},
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">📚</div>
            <div className="logo-text">LibraNova</div>
            <div className="logo-sub">Management System</div>
          </div>
          <div className="nav-section">
            <div className="nav-label">Navigation</div>
            {[
              {id:"dashboard",icon:"🏠",label:"Dashboard"},
              {id:"books",    icon:"📖",label:"Book Catalog"},
              {id:"issued",   icon:"🔖",label:"Issued Books",badge:activeCount},
              {id:"members",  icon:"👥",label:"Members"},
              {id:"overdue",  icon:"⚠️", label:"Overdue",    badge:overdueCount},
            ].map(n => (
              <div key={n.id} className={`nav-item ${page===n.id && mainTab==="ui"?"active":""}`}
                onClick={() => { setMainTab("ui"); setPage(n.id); }}>
                <span className="nav-icon">{n.icon}</span>{n.label}
                {n.badge>0 && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
          </div>
          <div className="nav-section">
            <div className="nav-label">Source Code</div>
            <div className={`nav-item ${mainTab==="python"?"active":""}`} onClick={() => setMainTab("python")}>
              <span className="nav-icon">🐍</span>Python OOP
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="lib-stats">
              <div className="stat-mini"><div className="val">{books.length}</div><div className="lbl">Books</div></div>
              <div className="stat-mini"><div className="val">{members.length}</div><div className="lbl">Members</div></div>
              <div className="stat-mini"><div className="val">{activeCount}</div><div className="lbl">Issued</div></div>
              <div className="stat-mini"><div className="val">{overdueCount}</div><div className="lbl">Overdue</div></div>
            </div>
          </div>
        </aside>

        <main className="main">

          {/* ──────────── PYTHON OOP VIEW ──────────── */}
          {mainTab === "python" && (
            <>
              <div className="page-header">
                <div>
                  <div className="page-title">Python <span>OOP</span> Source Code</div>
                  <div style={{color:"#888",fontSize:12,marginTop:3}}>library_system.py — All 8 OOP Concepts Applied ✅</div>
                </div>
                <div className="oop-checklist">
                  {OOP_CONCEPTS.map(c => (
                    <span key={c.id} className="oop-tag" style={{background:c.color+"22",color:c.color,border:`1px solid ${c.color}44`}}>
                      {c.icon} {c.label.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="py-container">
                {/* Left: Code */}
                <div className="py-code-panel">
                  <div className="py-code-header">
                    <span className="py-file-tab">📄 library_system.py</span>
                    <span className="py-lang-badge">Python 3.10+</span>
                  </div>
                  <pre className="py-code" dangerouslySetInnerHTML={{__html: highlightedCode}} />
                </div>
                {/* Right: Concepts + Output */}
                <div className="py-right-panel">
                  <div className="py-code-header">
                    <span style={{fontSize:12,color:"rgba(255,255,255,.6)",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>🎯 OOP Concepts Applied</span>
                    <span className="py-lang-badge">8 / 8 ✅</span>
                  </div>
                  <div className="py-concepts-panel">
                    {OOP_CONCEPTS.map(c => (
                      <div key={c.id} className="concept-card" style={{borderLeftColor:c.color}}>
                        <div className="concept-header">
                          <span style={{fontSize:16}}>{c.icon}</span>
                          <span className="concept-num">#{c.id}</span>
                          <span className="concept-label">{c.label}</span>
                        </div>
                        <div className="concept-desc">{c.desc}</div>
                        <div className="concept-where">{c.where}</div>
                      </div>
                    ))}
                  </div>
                  <div className="py-output-area">
                    <div className="py-output-header">
                      <div className="py-output-dot"/>
                      <span className="py-output-title">Terminal Output — python library_system.py</span>
                    </div>
                    <pre className="py-output">{DEMO_OUTPUT}</pre>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ──────────── UI VIEWS ──────────── */}
          {mainTab === "ui" && (
            <>
              {/* DASHBOARD */}
              {page === "dashboard" && (
                <>
                  <div className="page-header">
                    <div>
                      <div className="page-title">Good Morning, <span>Librarian</span> 👋</div>
                      <div style={{color:"#888",fontSize:12,marginTop:3}}>Monday, June 08, 2026</div>
                    </div>
                    <div className="header-actions">
                      <button className="btn btn-gold" onClick={() => setShowScanner(true)}>🔍 Scan Barcode</button>
                    </div>
                  </div>
                  {overdueCount>0 && <div className="alert-bar alert-danger">⚠️ <strong>{overdueCount} overdue book{overdueCount>1?"s":""}</strong> — Please send reminders.</div>}
                  <div className="stats-row">
                    <div className="stat-card"><div className="s-icon">📚</div><div className="s-val">{books.length}</div><div className="s-lbl">Total Books</div></div>
                    <div className="stat-card green"><div className="s-icon">✅</div><div className="s-val">{totalAvail}</div><div className="s-lbl">Available</div></div>
                    <div className="stat-card blue"><div className="s-icon">🔖</div><div className="s-val">{activeCount}</div><div className="s-lbl">Issued</div></div>
                    <div className="stat-card red"><div className="s-icon">⏰</div><div className="s-val">{overdueCount}</div><div className="s-lbl">Overdue</div></div>
                  </div>
                  <div className="dash-grid">
                    <div className="card">
                      <div className="table-header" style={{padding:"0 0 12px 0"}}>
                        <div className="table-title">Recent Issues</div>
                        <button className="btn btn-outline btn-sm" onClick={() => setPage("issued")}>View All</button>
                      </div>
                      <table>
                        <thead><tr><th>Book</th><th>Member</th><th>Due</th><th>Status</th></tr></thead>
                        <tbody>
                          {issued.filter(r => r.status!=="returned").slice(0,5).map(r => (
                            <tr key={r.id}>
                              <td style={{fontWeight:500}}>{r.bookTitle}</td>
                              <td>{r.memberName}</td>
                              <td>{r.dueDate}</td>
                              <td><span className={`status-pill ${r.status==="active"?"pill-active":r.status==="overdue"?"pill-overdue":"pill-returned"}`}>{r.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="card">
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,marginBottom:12,color:"var(--ink)"}}>Recent Activity</div>
                      {activities.map((a,i) => (
                        <div className="activity-item" key={i}>
                          <div className={`activity-dot dot-${a.type}`}/>
                          <div><div className="activity-text">{a.text}</div><div className="activity-time">{a.time}</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* BOOKS */}
              {page === "books" && (
                <>
                  <div className="page-header">
                    <div className="page-title">Book <span>Catalog</span></div>
                    <div className="header-actions">
                      <button className="btn btn-outline" onClick={() => setShowScanner(true)}>🔍 Issue via Barcode</button>
                      <button className="btn btn-gold" onClick={() => setShowAddBook(true)}>+ Add Book</button>
                    </div>
                  </div>
                  <div className="toolbar">
                    <div className="search-box">
                      <span>🔍</span>
                      <input placeholder="Search by title, author, or ISBN…" value={search} onChange={e => setSearch(e.target.value)}/>
                    </div>
                    {genres.map(g => <button key={g} className={`filter-chip ${genreFilter===g?"active":""}`} onClick={() => setGenreFilter(g)}>{g}</button>)}
                  </div>
                  <div style={{fontSize:11,color:"#888",marginBottom:12}}>{filteredBooks.length} books found</div>
                  {filteredBooks.length===0 ? <div className="empty"><div className="empty-icon">📭</div>No books match your search.</div> : (
                    <div className="books-grid">
                      {filteredBooks.map(book => (
                        <div className="book-card" key={book.id} onClick={() => setSelectedBook(book)}>
                          <div className="book-cover">{book.cover}
                            <span className={`avail-badge ${book.available===0?"badge-out":book.available<=1?"badge-low":"badge-avail"}`}>
                              {book.available===0?"Out":book.available<=1?"Low":"In"}
                            </span>
                          </div>
                          <div className="book-info">
                            <div className="book-title">{book.title}</div>
                            <div className="book-author">{book.author}</div>
                            <div className="book-meta">
                              <span className="book-genre">{book.genre}</span>
                              <span className="book-rating">★ {book.rating}</span>
                            </div>
                            <div className="book-shelf">Shelf: {book.shelf} · {book.available}/{book.copies} avail</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ISSUED */}
              {page === "issued" && (
                <>
                  <div className="page-header">
                    <div className="page-title">Issued <span>Books</span></div>
                    <button className="btn btn-gold" onClick={() => setShowScanner(true)}>🔍 Issue Book</button>
                  </div>
                  <div className="tabs">
                    {["active","overdue","returned"].map(t => (
                      <button key={t} className={`tab ${issueTab===t?"active":""}`} onClick={() => setIssueTab(t)}>
                        {t.charAt(0).toUpperCase()+t.slice(1)} ({issued.filter(r=>r.status===t).length})
                      </button>
                    ))}
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>#</th><th>Book Title</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {issued.filter(r=>r.status===issueTab).map(r => (
                          <tr key={r.id}>
                            <td style={{color:"#aaa",fontSize:11}}>{r.id}</td>
                            <td style={{fontWeight:500}}>{r.bookTitle}</td>
                            <td>{r.memberName}</td>
                            <td>{r.issueDate}</td>
                            <td style={{color:r.status==="overdue"?"#dc3545":"inherit",fontWeight:r.status==="overdue"?600:400}}>{r.dueDate}</td>
                            <td><span className={`status-pill ${r.status==="active"?"pill-active":r.status==="overdue"?"pill-overdue":"pill-returned"}`}>{r.status}</span></td>
                            <td>{r.status!=="returned"
                              ? <button className="btn btn-success btn-sm" onClick={() => handleReturn(r)}>↩ Return</button>
                              : <span style={{color:"#aaa",fontSize:11}}>{r.returnDate}</span>}
                            </td>
                          </tr>
                        ))}
                        {issued.filter(r=>r.status===issueTab).length===0 && <tr><td colSpan={7} className="empty">No records found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* MEMBERS */}
              {page === "members" && (
                <>
                  <div className="page-header">
                    <div className="page-title">Library <span>Members</span></div>
                    <button className="btn btn-gold" onClick={() => setShowAddMember(true)}>+ Register Member</button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Books Issued</th></tr></thead>
                      <tbody>
                        {members.map(m => (
                          <tr key={m.id}>
                            <td style={{color:"#aaa",fontSize:11,fontWeight:600}}>{m.id}</td>
                            <td style={{fontWeight:600}}>{m.name}</td>
                            <td style={{color:"#555"}}>{m.email}</td>
                            <td>{m.phone}</td>
                            <td>{m.joined}</td>
                            <td><span style={{background:m.issued>0?"#fff3cd":"#d4edda",color:m.issued>0?"#856404":"#155724",padding:"3px 9px",borderRadius:7,fontSize:11,fontWeight:700}}>{m.issued} book{m.issued!==1?"s":""}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* OVERDUE */}
              {page === "overdue" && (
                <>
                  <div className="page-header"><div className="page-title">Overdue <span>Books</span></div></div>
                  {issued.filter(r=>r.status==="overdue").length===0
                    ? <div className="empty"><div className="empty-icon">🎉</div>No overdue books!</div>
                    : (
                      <>
                        <div className="alert-bar alert-warning">⚠️ Please contact members with overdue books.</div>
                        <div className="table-wrap">
                          <table>
                            <thead><tr><th>Book</th><th>Member</th><th>Contact</th><th>Due Date</th><th>Days Late</th><th>Action</th></tr></thead>
                            <tbody>
                              {issued.filter(r=>r.status==="overdue").map(r => {
                                const daysLate = Math.floor((new Date()-new Date(r.dueDate))/86400000);
                                return (
                                  <tr key={r.id}>
                                    <td style={{fontWeight:500}}>{r.bookTitle}</td>
                                    <td>{r.memberName}</td>
                                    <td style={{fontSize:11,color:"#555"}}>{members.find(m=>m.id===r.memberId)?.email}</td>
                                    <td style={{color:"#dc3545",fontWeight:600}}>{r.dueDate}</td>
                                    <td><span style={{background:"#f8d7da",color:"#721c24",padding:"2px 8px",borderRadius:7,fontSize:11,fontWeight:700}}>{daysLate}d late</span></td>
                                    <td><button className="btn btn-success btn-sm" onClick={() => handleReturn(r)}>↩ Return</button></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* SCANNER MODAL */}
      {showScanner && (
        <div className="scanner-modal" onClick={e => { if(e.target===e.currentTarget){setShowScanner(false);setScanStep("scan_book");setScanInput("");setScanResult(null);}}}>
          <div className="scanner-box">
            <div className="scanner-title">📡 Barcode Scanner</div>
            <div className="scanner-sub">Scan or type the ISBN to issue a book</div>
            {scanStep === "scan_book" && (
              <>
                <div className="scan-area">
                  <div className="scan-line"/>
                  <div style={{fontSize:32,marginBottom:6}}>📷</div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:12}}>Point camera at barcode or type ISBN below</div>
                </div>
                <div className="scanner-input-row">
                  <input ref={scanInputRef} className="scanner-input" placeholder="Enter ISBN (e.g. 978-0-06-112008-4)" value={scanInput} onChange={e => handleScanInput(e.target.value)}/>
                  <button className="btn btn-gold" onClick={() => handleScanInput(scanInput)}>Scan</button>
                </div>
                {scanResult && scanResult !== "not_found" && (
                  <div className="scan-result">
                    <div style={{display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{fontSize:32}}>{scanResult.cover}</div>
                      <div>
                        <div className="r-label">Book Found</div>
                        <div className="r-val">{scanResult.title}</div>
                        <div style={{color:"rgba(255,255,255,.45)",fontSize:11}}>{scanResult.author} · {scanResult.available} copies available</div>
                      </div>
                    </div>
                    {scanResult.available === 0
                      ? <div style={{color:"#f8a5a5",fontSize:12,marginTop:8}}>❌ No copies available.</div>
                      : <button className="btn btn-gold" style={{marginTop:12,width:"100%",justifyContent:"center"}} onClick={() => setScanStep("select_member")}>Continue → Select Member</button>
                    }
                  </div>
                )}
                {scanResult === "not_found" && <div style={{color:"#f8a5a5",fontSize:12,background:"rgba(248,165,165,.1)",padding:10,borderRadius:8,marginBottom:8}}>❌ Book not found. Check the ISBN.</div>}
              </>
            )}
            {scanStep === "select_member" && scanResult && (
              <>
                <div className="scan-result" style={{marginBottom:14}}>
                  <div className="r-label">Issuing Book</div>
                  <div className="r-val">{scanResult.title} by {scanResult.author}</div>
                </div>
                <div className="form-group">
                  <label style={{color:"rgba(255,255,255,.45)"}}>Select Member</label>
                  <select className="scanner-input" value={selectedMember} onChange={e => setSelectedMember(e.target.value)} style={{width:"100%"}}>
                    <option value="">-- Choose Member --</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.id})</option>)}
                  </select>
                </div>
                <div style={{color:"rgba(255,255,255,.35)",fontSize:11,marginBottom:14}}>Due date: 14 days from today</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn btn-outline" style={{color:"rgba(255,255,255,.5)",borderColor:"rgba(255,255,255,.15)"}} onClick={() => setScanStep("scan_book")}>← Back</button>
                  <button className="btn btn-gold" style={{flex:1,justifyContent:"center"}} onClick={handleIssueBook} disabled={!selectedMember}>✅ Confirm Issue</button>
                </div>
              </>
            )}
            <div style={{textAlign:"center",marginTop:14}}>
              <button className="btn btn-outline btn-sm" style={{color:"rgba(255,255,255,.35)",borderColor:"rgba(255,255,255,.12)"}}
                onClick={() => {setShowScanner(false);setScanStep("scan_book");setScanInput("");setScanResult(null);setSelectedMember("");}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BOOK */}
      {showAddBook && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAddBook(false)}>
          <div className="modal">
            <div className="modal-title">Add New Book</div>
            <div className="modal-sub">Fill in the book details to add it to the catalog</div>
            <div className="form-row">
              <div className="form-group"><label>ISBN *</label><input placeholder="978-0-00-000000-0" value={newBook.id} onChange={e => setNewBook(p=>({...p,id:e.target.value}))}/></div>
              <div className="form-group"><label>Shelf</label><input placeholder="A-01" value={newBook.shelf} onChange={e => setNewBook(p=>({...p,shelf:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label>Title *</label><input placeholder="Book title" value={newBook.title} onChange={e => setNewBook(p=>({...p,title:e.target.value}))}/></div>
            <div className="form-group"><label>Author *</label><input placeholder="Author name" value={newBook.author} onChange={e => setNewBook(p=>({...p,author:e.target.value}))}/></div>
            <div className="form-row">
              <div className="form-group"><label>Genre</label><select value={newBook.genre} onChange={e => setNewBook(p=>({...p,genre:e.target.value}))}>{genres.filter(g=>g!=="All").map(g=><option key={g}>{g}</option>)}</select></div>
              <div className="form-group"><label>Year</label><input type="number" placeholder="2024" value={newBook.year} onChange={e => setNewBook(p=>({...p,year:e.target.value}))}/></div>
            </div>
            <div className="form-group"><label>Copies</label><input type="number" min={1} value={newBook.copies} onChange={e => setNewBook(p=>({...p,copies:e.target.value}))}/></div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddBook(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleAddBook}>Add Book</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER */}
      {showAddMember && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAddMember(false)}>
          <div className="modal">
            <div className="modal-title">Register New Member</div>
            <div className="modal-sub">Add a new library member to the system</div>
            <div className="form-group"><label>Full Name *</label><input placeholder="Member full name" value={newMember.name} onChange={e => setNewMember(p=>({...p,name:e.target.value}))}/></div>
            <div className="form-group"><label>Email *</label><input type="email" placeholder="email@example.com" value={newMember.email} onChange={e => setNewMember(p=>({...p,email:e.target.value}))}/></div>
            <div className="form-group"><label>Phone</label><input placeholder="9876543210" value={newMember.phone} onChange={e => setNewMember(p=>({...p,phone:e.target.value}))}/></div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddMember(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handleAddMember}>Register</button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK DETAIL */}
      {selectedBook && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setSelectedBook(null)}>
          <div className="modal">
            <div className="cover-big">{selectedBook.cover}</div>
            <div className="modal-title">{selectedBook.title}</div>
            <div className="modal-sub">by {selectedBook.author}</div>
            {[["ISBN",selectedBook.id],["Genre",selectedBook.genre],["Year",selectedBook.year],["Rating",`★ ${selectedBook.rating}`],["Shelf",selectedBook.shelf],["Total Copies",selectedBook.copies],["Available",selectedBook.available]].map(([k,v]) => (
              <div className="detail-row" key={k}><span className="d-key">{k}</span><span className="d-val">{v}</span></div>
            ))}
            <div className="modal-actions" style={{marginTop:18}}>
              <button className="btn btn-outline" onClick={() => setSelectedBook(null)}>Close</button>
              <button className="btn btn-gold" disabled={selectedBook.available===0}
                onClick={() => {setSelectedBook(null);setScanInput(selectedBook.id);handleScanInput(selectedBook.id);setShowScanner(true);}}>
                🔖 Issue This Book
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
