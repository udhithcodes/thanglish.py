import logging
from sqlalchemy.orm import Session
from app.models.user import User, AuthIdentity
from app.models.question import Topic, Question, QuestionOption, QuestionTranslation, CodingTestCase
from app.core.security import hash_password
from app.services.auth_service import generate_next_user_id

logger = logging.getLogger(__name__)

INITIAL_TOPICS = [
    # Beginner
    {"name": "Python Syntax & Variables", "slug": "syntax-variables", "level": "Beginner", "description": "Learn python keywords, variables, dynamic typing, and print statements.", "icon": "terminal", "order": 1},
    {"name": "Operators & Expressions", "slug": "operators", "level": "Beginner", "description": "Master arithmetic, logical, comparison, and assignment operators.", "icon": "plus-circle", "order": 2},
    {"name": "Conditionals (If, Elif, Else)", "slug": "conditionals", "level": "Beginner", "description": "Control program flow with boolean logic and decision making.", "icon": "git-branch", "order": 3},
    {"name": "Loops (For & While)", "slug": "loops", "level": "Beginner", "description": "Iterate across sequences and repeat execution until conditions change.", "icon": "repeat", "order": 4},
    {"name": "Lists & Tuples", "slug": "lists-tuples", "level": "Beginner", "description": "Ordered collections, indexing, slicing, and mutable list operations.", "icon": "list", "order": 5},
    {"name": "Dictionaries & Sets", "slug": "dicts-sets", "level": "Beginner", "description": "Key-value mappings and unique unordered mathematical sets.", "icon": "hash", "order": 6},
    {"name": "Functions & Scope", "slug": "functions", "level": "Beginner", "description": "Define modular reusable code blocks with parameters and return values.", "icon": "box", "order": 7},

    # Intermediate
    {"name": "List Comprehensions & Slicing", "slug": "comprehensions", "level": "Intermediate", "description": "Elegant one-line list generators and multi-step slicing.", "icon": "zap", "order": 8},
    {"name": "String Algorithms & Formatting", "slug": "strings-advanced", "level": "Intermediate", "description": "Palindromes, frequency maps, f-strings, and string transformations.", "icon": "type", "order": 9},
    {"name": "File Handling", "slug": "file-handling", "level": "Intermediate", "description": "Read, write, append text and CSV files using safe context managers.", "icon": "file-text", "order": 10},
    {"name": "Exception Handling", "slug": "exceptions", "level": "Intermediate", "description": "Safely catch errors using try, except, else, and finally.", "icon": "alert-triangle", "order": 11},
    {"name": "Lambda, Map & Filter", "slug": "functional-python", "level": "Intermediate", "description": "Anonymous functions and functional programming primitives.", "icon": "cpu", "order": 12},

    # Advanced
    {"name": "OOP (Classes & Inheritance)", "slug": "oop", "level": "Advanced", "description": "Object-oriented design, constructors, inheritance, and encapsulation.", "icon": "layers", "order": 13},
    {"name": "Decorators & Generators", "slug": "decorators-generators", "level": "Advanced", "description": "Function wrappers, closures, memory-efficient lazy streams with yield.", "icon": "sparkles", "order": 14},
    {"name": "Data Structures & Big-O", "slug": "dsa-python", "level": "Advanced", "description": "Time complexity, stacks, queues, and efficient algorithms.", "icon": "activity", "order": 15},
]

INITIAL_QUESTIONS = [
    # --- BEGINNER: Syntax & Variables ---
    {
        "topic_slug": "syntax-variables",
        "level": "Beginner",
        "question_type": "mcq",
        "title": "Variable Assignment in Python",
        "english_question": "Which of the following is a valid variable name in Python?",
        "tanglish_question": "Indha options-la edhu correct-aana Python variable name?",
        "tamil_question": "பின்வரும் விருப்பங்களில் எது சரியான Python மாறி பெயர் (variable name)?",
        "code_snippet": None,
        "options": [
            {"key": "A", "text": "2nd_student", "correct": False},
            {"key": "B", "text": "_student_score", "correct": True},
            {"key": "C", "text": "student-score", "correct": False},
            {"key": "D", "text": "for", "correct": False}
        ],
        "explanation": "Variable names in Python can start with an underscore (_) or letter, but cannot start with a digit, contain hyphens (-), or use reserved keywords like 'for'.",
        "tanglish_explanation": "Python-la variable name underscore (_) illa letter-la start aaganum. Numbers-la start aaga koodadhu, hyphens (-) irukka koodadhu, 'for' maadhiri keywords use panna koodadhu.",
        "hints": "Variables cannot begin with numbers or use reserved keywords like 'for'.",
        "points": 10
    },
    {
        "topic_slug": "syntax-variables",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Type Checking with type()",
        "english_question": "What is the output of the following code?",
        "tanglish_question": "Keela irukkura code-oda output enna-nu kandupidinga?",
        "tamil_question": "கீழே கொடுக்கப்பட்டுள்ள குறியீட்டின் வெளியீடு (output) என்ன?",
        "code_snippet": "x = 5 / 2\nprint(type(x))",
        "expected_output": "<class 'float'>",
        "options": [
            {"key": "A", "text": "<class 'int'>", "correct": False},
            {"key": "B", "text": "<class 'float'>", "correct": True},
            {"key": "C", "text": "<class 'double'>", "correct": False},
            {"key": "D", "text": "2.5", "correct": False}
        ],
        "explanation": "In Python 3, the single division operator `/` always produces a float (2.5), so its type is float.",
        "tanglish_explanation": "Python 3-la single slash `/` eppovum decimal value (float: 2.5) tharum, adhanaala type float-aa irukkum.",
        "hints": "Division `/` in Python 3 always returns a floating-point number.",
        "points": 10
    },
    {
        "topic_slug": "syntax-variables",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Integer Division Floor Operator",
        "english_question": "What will be printed when this code is executed?",
        "tanglish_question": "Indha code-ai run pannum bodhu enna print aagum?",
        "tamil_question": "இந்தக் குறியீட்டை இயக்கும் போது என்ன அச்சிடப்படும்?",
        "code_snippet": "a = 17 // 3\nprint(a)",
        "expected_output": "5",
        "options": [
            {"key": "A", "text": "5.66", "correct": False},
            {"key": "B", "text": "5", "correct": True},
            {"key": "C", "text": "6", "correct": False},
            {"key": "D", "text": "2", "correct": False}
        ],
        "explanation": "The `//` operator performs floor division, rounding down to the nearest integer (17 // 3 = 5).",
        "tanglish_explanation": "`//` operator floor division pannum, decimal points edukkama lower integer value (5) mattum tharum.",
        "hints": "// divides and truncates the decimal part.",
        "points": 10
    },

    # --- BEGINNER: Conditionals ---
    {
        "topic_slug": "conditionals",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Ternary Conditional Expression",
        "english_question": "What will be the output of the following conditional expression?",
        "tanglish_question": "Indha conditional expression-oda output enna-nu paarunga?",
        "tamil_question": "இந்த நிபந்தனைக் குறியீட்டின் வெளியீடு என்னவாக இருக்கும்?",
        "code_snippet": "marks = 75\nstatus = 'Pass' if marks >= 50 else 'Fail'\nprint(status)",
        "expected_output": "Pass",
        "options": [
            {"key": "A", "text": "Pass", "correct": True},
            {"key": "B", "text": "Fail", "correct": False},
            {"key": "C", "text": "True", "correct": False},
            {"key": "D", "text": "SyntaxError", "correct": False}
        ],
        "explanation": "Since marks (75) is greater than or equal to 50, the ternary expression assigns 'Pass' to status.",
        "tanglish_explanation": "Marks 75 irukkiradhaala (>= 50 condition true), status variable-ku 'Pass' assign aagi print aagum.",
        "hints": "Check if 75 >= 50 evaluates to True.",
        "points": 10
    },

    # --- BEGINNER: Loops ---
    {
        "topic_slug": "loops",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Range Function Step Argument",
        "english_question": "What is the output of the following loop?",
        "tanglish_question": "Indha loop run aagum bodhu enna output varum?",
        "tamil_question": "பின்வரும் சுழற்சியின் (loop) வெளியீடு என்ன?",
        "code_snippet": "for i in range(1, 10, 3):\n    print(i, end=' ')",
        "expected_output": "1 4 7 ",
        "options": [
            {"key": "A", "text": "1 4 7", "correct": True},
            {"key": "B", "text": "1 4 7 10", "correct": False},
            {"key": "C", "text": "3 6 9", "correct": False},
            {"key": "D", "text": "1 2 3", "correct": False}
        ],
        "explanation": "range(start, stop, step) begins at 1 and increments by 3: 1, 4, 7. It stops before reaching 10.",
        "tanglish_explanation": "range(1, 10, 3) 1-la start aagi 3, 3-aa increment aagum: 1, 4, 7. 10-kku munnadiye stop aayidum.",
        "hints": "Start at 1, add 3 each step, stop before 10.",
        "points": 10
    },
    {
        "topic_slug": "loops",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "While Loop with Break",
        "english_question": "What gets printed by this while loop?",
        "tanglish_question": "Indha while loop-la enna print aagum?",
        "tamil_question": "இந்த while சுழற்சியால் என்ன அச்சிடப்படும்?",
        "code_snippet": "count = 0\nwhile count < 5:\n    if count == 2:\n        break\n    count += 1\nprint(count)",
        "expected_output": "2",
        "options": [
            {"key": "A", "text": "0", "correct": False},
            {"key": "B", "text": "2", "correct": True},
            {"key": "C", "text": "3", "correct": False},
            {"key": "D", "text": "5", "correct": False}
        ],
        "explanation": "When count reaches 2, the `break` statement immediately terminates the loop. `count` remains 2.",
        "tanglish_explanation": "Count 2 aagum bodhu `break` execute aagi loop udane ninnudum. So count value 2 irukkum.",
        "hints": "break exits the loop immediately when triggered.",
        "points": 10
    },

    # --- BEGINNER: Lists & Tuples ---
    {
        "topic_slug": "lists-tuples",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Negative Indexing in Lists",
        "english_question": "What is the output of the following list index?",
        "tanglish_question": "Indha list indexing-la enna element print aagum?",
        "tamil_question": "பின்வரும் பட்டியல் குறியீட்டின் (list index) வெளியீடு என்ன?",
        "code_snippet": "fruits = ['apple', 'banana', 'mango', 'orange']\nprint(fruits[-2])",
        "expected_output": "mango",
        "options": [
            {"key": "A", "text": "orange", "correct": False},
            {"key": "B", "text": "banana", "correct": False},
            {"key": "C", "text": "mango", "correct": True},
            {"key": "D", "text": "apple", "correct": False}
        ],
        "explanation": "Negative indexing starts from the end. `-1` is 'orange', and `-2` is 'mango'.",
        "tanglish_explanation": "Negative index kadaisi la irundhu start aagum. `-1` orange, `-2` mango.",
        "hints": "fruits[-1] is the last item, fruits[-2] is the second to last item.",
        "points": 10
    },
    {
        "topic_slug": "lists-tuples",
        "level": "Beginner",
        "question_type": "mcq",
        "title": "Mutability Difference: List vs Tuple",
        "english_question": "What is the key difference between a List and a Tuple in Python?",
        "tanglish_question": "Python-la List-kum Tuple-kum irukkura mukkiyamana difference enna?",
        "tamil_question": "பைத்தானில் பட்டியல் (List) மற்றும் வரிசைக்கு (Tuple) இடையே உள்ள முக்கிய வேறுபாடு என்ன?",
        "code_snippet": None,
        "options": [
            {"key": "A", "text": "Lists are mutable, while tuples are immutable", "correct": True},
            {"key": "B", "text": "Tuples can only store numbers", "correct": False},
            {"key": "C", "text": "Lists use parentheses (), tuples use square brackets []", "correct": False},
            {"key": "D", "text": "Tuples cannot be indexed", "correct": False}
        ],
        "explanation": "Lists can be modified after creation (mutable), whereas Tuples cannot be modified (immutable).",
        "tanglish_explanation": "List-ai create pannadhukku apparam maathalaam (mutable), aana Tuple-ai maatha mudiyaadhu (immutable).",
        "hints": "Think about whether you can change items after creating them.",
        "points": 10
    },

    # --- BEGINNER: Dictionaries & Sets ---
    {
        "topic_slug": "dicts-sets",
        "level": "Beginner",
        "question_type": "predict_output",
        "title": "Dictionary get() Method with Default",
        "english_question": "What does this dictionary get() call return?",
        "tanglish_question": "Indha dict get() function enna value return pannum?",
        "tamil_question": "இந்த அகராதி (dictionary) get() செயல்பாடு என்ன மதிப்பைத் தரும்?",
        "code_snippet": "user = {'name': 'Udhith', 'role': 'Developer'}\nprint(user.get('country', 'India'))",
        "expected_output": "India",
        "options": [
            {"key": "A", "text": "None", "correct": False},
            {"key": "B", "text": "KeyError", "correct": False},
            {"key": "C", "text": "India", "correct": True},
            {"key": "D", "text": "Developer", "correct": False}
        ],
        "explanation": "Because 'country' does not exist in the dictionary, `dict.get(key, default)` returns the default fallback value 'India'.",
        "tanglish_explanation": "'country' key dict-la illadha kaaranathaala, default fallback aana 'India' return aagum.",
        "hints": "get() returns the second argument when the key is not found.",
        "points": 10
    },

    # --- INTERMEDIATE: Comprehensions ---
    {
        "topic_slug": "comprehensions",
        "level": "Intermediate",
        "question_type": "predict_output",
        "title": "List Comprehension with Filtering",
        "english_question": "What is the result of this list comprehension?",
        "tanglish_question": "Indha list comprehension-oda result enna-nu sollunga?",
        "tamil_question": "இந்த பட்டியல் சுருக்கத்தின் (list comprehension) முடிவு என்ன?",
        "code_snippet": "evens = [x**2 for x in range(6) if x % 2 == 0]\nprint(evens)",
        "expected_output": "[0, 4, 16]",
        "options": [
            {"key": "A", "text": "[0, 4, 16]", "correct": True},
            {"key": "B", "text": "[0, 2, 4]", "correct": False},
            {"key": "C", "text": "[4, 16, 36]", "correct": False},
            {"key": "D", "text": "[1, 9, 25]", "correct": False}
        ],
        "explanation": "range(6) gives 0, 1, 2, 3, 4, 5. Even numbers are 0, 2, 4. Their squares are 0, 4, 16.",
        "tanglish_explanation": "range(6)-la even numbers 0, 2, 4 mattum filter aagi, avatrin square [0, 4, 16] list-aa create aagum.",
        "hints": "Filter even numbers first (0, 2, 4), then square them.",
        "points": 15
    },

    # --- INTERMEDIATE: String Algorithms ---
    {
        "topic_slug": "strings-advanced",
        "level": "Intermediate",
        "question_type": "predict_output",
        "title": "Python String Reverse Slicing",
        "english_question": "What will be printed when reversing a string using step slicing?",
        "tanglish_question": "String slice step use panni reverse pannum bodhu enna print aagum?",
        "tamil_question": "ஒரு சரத்தை (string) பின்னோக்கிப் பிரித்தெடுக்கும் போது என்ன அச்சிடப்படும்?",
        "code_snippet": "word = 'Python'\nprint(word[::-1])",
        "expected_output": "nohtyP",
        "options": [
            {"key": "A", "text": "Python", "correct": False},
            {"key": "B", "text": "nohtyP", "correct": True},
            {"key": "C", "text": "P", "correct": False},
            {"key": "D", "text": "n", "correct": False}
        ],
        "explanation": "`[::-1]` steps through the string backwards from the last character to the first.",
        "tanglish_explanation": "`[::-1]` string-ai kadaisi ezhuthula irundhu pinnadi step panni reverse pannum.",
        "hints": "Step -1 reverses the entire sequence.",
        "points": 15
    },

    # --- INTERMEDIATE: Exception Handling ---
    {
        "topic_slug": "exceptions",
        "level": "Intermediate",
        "question_type": "predict_output",
        "title": "Try, Except, Else, Finally Execution Order",
        "english_question": "What is the output of this try-except-finally block?",
        "tanglish_question": "Indha exception block run aagi mudiyum bodhu enna sequence print aagum?",
        "tamil_question": "இந்த try-except-finally தொகுதியின் வெளியீடு என்ன?",
        "code_snippet": "res = []\ntry:\n    res.append('try')\n    val = 10 / 2\nexcept ZeroDivisionError:\n    res.append('except')\nelse:\n    res.append('else')\nfinally:\n    res.append('finally')\nprint('-'.join(res))",
        "expected_output": "try-else-finally",
        "options": [
            {"key": "A", "text": "try-finally", "correct": False},
            {"key": "B", "text": "try-else-finally", "correct": True},
            {"key": "C", "text": "try-except-finally", "correct": False},
            {"key": "D", "text": "try-else", "correct": False}
        ],
        "explanation": "No error occurs, so 'try' runs, 'else' executes because there was no exception, and 'finally' always runs.",
        "tanglish_explanation": "Error edhum varaadhadhaala 'try' mudinji 'else' execute aagum, kadaisiya 'finally' eppovum pola run aagum.",
        "hints": "'else' runs only if no exception occurred. 'finally' runs regardless.",
        "points": 15
    },

    # --- ADVANCED: OOP ---
    {
        "topic_slug": "oop",
        "level": "Advanced",
        "question_type": "predict_output",
        "title": "Inheritance and super() Initialization",
        "english_question": "What is the output of the following class hierarchy?",
        "tanglish_question": "Indha OOP inheritance code-oda output enna-nu kandupidinga?",
        "tamil_question": "பின்வரும் வகுப்பு மரபுரிமையின் (class inheritance) வெளியீடு என்ன?",
        "code_snippet": "class Animal:\n    def speak(self):\n        return 'Sound'\n\nclass Dog(Animal):\n    def speak(self):\n        return super().speak() + ' & Bark'\n\nd = Dog()\nprint(d.speak())",
        "expected_output": "Sound & Bark",
        "options": [
            {"key": "A", "text": "Bark", "correct": False},
            {"key": "B", "text": "Sound", "correct": False},
            {"key": "C", "text": "Sound & Bark", "correct": True},
            {"key": "D", "text": "AttributeError", "correct": False}
        ],
        "explanation": "`super().speak()` calls the parent `Animal.speak()` returning 'Sound', which is concatenated with ' & Bark'.",
        "tanglish_explanation": "`super().speak()` parent class method-ai call panni 'Sound' kondu varum, adhoda ' & Bark' sernthu print aagum.",
        "hints": "super() delegates the method call to the parent class.",
        "points": 20
    },

    # --- ADVANCED: Decorators ---
    {
        "topic_slug": "decorators-generators",
        "level": "Advanced",
        "question_type": "predict_output",
        "title": "Function Decorator Execution",
        "english_question": "What is the output when decorating the greet function?",
        "tanglish_question": "Indha decorator use panna function-oda output enna?",
        "tamil_question": "இந்த decorator கொண்டு மாற்றியமைக்கப்பட்ட செயல்பாட்டின் வெளியீடு என்ன?",
        "code_snippet": "def shout(func):\n    def wrapper(name):\n        return func(name).upper() + '!'\n    return wrapper\n\n@shout\ndef greet(name):\n    return f'vanakkam {name}'\n\nprint(greet('python'))",
        "expected_output": "VANAKKAM PYTHON!",
        "options": [
            {"key": "A", "text": "vanakkam python!", "correct": False},
            {"key": "B", "text": "VANAKKAM PYTHON!", "correct": True},
            {"key": "C", "text": "VANAKKAM PYTHON", "correct": False},
            {"key": "D", "text": "vanakkam python", "correct": False}
        ],
        "explanation": "The decorator wrapper intercepts the string returned by `greet`, converts it to uppercase, and appends an exclamation mark.",
        "tanglish_explanation": "Decorator wrapper `greet` return panra text-ai uppercase-aa maathi kadaisila '!' add pannum.",
        "hints": "The decorator modifies the return value to uppercase and adds '!'.",
        "points": 20
    },

    # --- ADVANCED: Generators ---
    {
        "topic_slug": "decorators-generators",
        "level": "Advanced",
        "question_type": "predict_output",
        "title": "Yield in Python Generators",
        "english_question": "What is the output of the generator expression below?",
        "tanglish_question": "Indha generator-la next() call pannum bodhu enna print aagum?",
        "tamil_question": "இந்த generator மூலம் என்ன மதிப்பு அச்சிடப்படும்?",
        "code_snippet": "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\ngen = countdown(3)\nprint(next(gen), next(gen))",
        "expected_output": "3 2",
        "options": [
            {"key": "A", "text": "3 2", "correct": True},
            {"key": "B", "text": "3 3", "correct": False},
            {"key": "C", "text": "2 1", "correct": False},
            {"key": "D", "text": "3 2 1", "correct": False}
        ],
        "explanation": "`yield` pauses the generator function and emits the current value. The first `next()` yields 3; the second yields 2.",
        "tanglish_explanation": "`yield` execution-ai pause panni values tharum. First `next()` 3 tharum, adutha `next()` 2 tharum.",
        "hints": "Each call to next() resumes execution until the next yield.",
        "points": 20
    }
]

def init_db_data(db: Session):
    """Populates default admin user, topics, and question bank with translations."""
    # 1. Admin User
    admin_email = "admin@thanglish.py"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        admin_id = generate_next_user_id(db)
        admin = User(
            user_id=admin_id,
            full_name="Thanglish Admin",
            email=admin_email,
            password_hash=hash_password("AdminPass123!"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.flush()
        identity = AuthIdentity(
            user_id=admin.id,
            provider="email",
            provider_user_id=admin.email,
            provider_email=admin.email
        )
        db.add(identity)
        db.commit()
        logger.info(f"Initialized default administrator account: {admin_email} (ID: {admin_id})")

    # 2. Topics
    topic_map = {}
    for top_data in INITIAL_TOPICS:
        t = db.query(Topic).filter(Topic.slug == top_data["slug"]).first()
        if not t:
            t = Topic(
                name=top_data["name"],
                slug=top_data["slug"],
                level=top_data["level"],
                description=top_data["description"],
                icon=top_data["icon"],
                order=top_data["order"]
            )
            db.add(t)
            db.flush()
        topic_map[top_data["slug"]] = t.id
    db.commit()

    # 3. Questions & Translations
    for q_data in INITIAL_QUESTIONS:
        existing = db.query(Question).filter(Question.title == q_data["title"]).first()
        if existing:
            continue

        topic_id = topic_map.get(q_data["topic_slug"])
        if not topic_id:
            continue

        q = Question(
            topic_id=topic_id,
            level=q_data["level"],
            question_type=q_data["question_type"],
            title=q_data["title"],
            english_question=q_data["english_question"],
            code_snippet=q_data.get("code_snippet"),
            expected_output=q_data.get("expected_output"),
            explanation=q_data.get("explanation"),
            hints=q_data.get("hints"),
            points=q_data.get("points", 10),
            is_active=True
        )
        db.add(q)
        db.flush()

        # Add Options
        for idx, opt in enumerate(q_data.get("options", [])):
            op = QuestionOption(
                question_id=q.id,
                option_key=opt["key"],
                option_text=opt["text"],
                is_correct=opt["correct"],
                order=idx
            )
            db.add(op)

        # Add Tanglish Translation
        if q_data.get("tanglish_question"):
            tr_tanglish = QuestionTranslation(
                question_id=q.id,
                language="tanglish",
                translated_question=q_data["tanglish_question"],
                translated_explanation=q_data.get("tanglish_explanation"),
                status="verified",
                reviewed=True
            )
            db.add(tr_tanglish)

        # Add Tamil Translation
        if q_data.get("tamil_question"):
            tr_tamil = QuestionTranslation(
                question_id=q.id,
                language="ta",
                translated_question=q_data["tamil_question"],
                translated_explanation=q_data.get("explanation"),
                status="verified",
                reviewed=True
            )
            db.add(tr_tamil)

    db.commit()
    logger.info("Successfully seeded database with topics, questions, and translations.")
