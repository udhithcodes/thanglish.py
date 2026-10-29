import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCodePlayground } from '../context/CodePlaygroundContext';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import {
  BookOpen, Terminal, CheckCircle2, ChevronRight, ChevronLeft,
  Search, Briefcase, Sparkles, SplitSquareVertical, ArrowRight,
  Code2, Lightbulb, Play, Bookmark, Layers
} from 'lucide-react';

// 10 Career Modules grouping 50 Topics with tutorials, workplace keywords, and code examples
const CURRICULUM_DATA = [
  {
    moduleId: 1,
    moduleName: "Module 1: Python Foundations & Syntax",
    topics: [
      {
        slug: "print-output-formatting",
        name: "print() & Output Formatting",
        careerNote: "Production logging and CLI tools rely on formatted stdout outputs. Developers must know sep, end, and multi-line formatting.",
        tutorialEn: "The `print()` function is the standard way to produce output in Python. By default, each print call ends with a newline (`\\n`), and arguments are separated by a single space. You can customize this behavior using the `sep` (separator) and `end` parameters.",
        tutorialTanglish: "Python-la `print()` function use panni output console-la show pannuvom. Default-a ovvoru print-ku apram pudhu line (`\\n`) varum. Rendu words naduvula space varum. Idhai maatha `sep=','` and `end=' '` parameters use pannalaam.",
        tutorialTamil: "`print()` செயல்பாடு பைத்தானில் வெளியீட்டை அச்சிட பயன்படுகிறது. இயல்பாக இது ஒரு வரியை முடித்துவிட்டு புதிய வரியில் தொடங்கும். இதை மாற்ற `sep` மற்றும் `end` அளபுருக்களைப் பயன்படுத்தலாம்.",
        keywords: [
          { term: "Standard Output (stdout)", tanglish: "Terminal console-la print aagi vara normal text output." },
          { term: "Delimiter / Separator", tanglish: "Multiple values naduvula poda vendiya character (eg: comma, hyphen)." },
          { term: "Escape Sequences", tanglish: "`\\n` (new line) and `\\t` (tab space) maadhiri special characters." }
        ],
        codeExamples: [
          {
            title: "Custom Separator and End Parameter",
            code: "# Controlling output formatting\nprint('Python', 'Tanglish', 'Tamil', sep=' -> ')\nprint('Learning is fun', end='! 🚀\\n')",
            output: "Python -> Tanglish -> Tamil\nLearning is fun! 🚀"
          },
          {
            title: "Multi-line String Output",
            code: "card = '''\n--- STUDENT PROFILE ---\nName: Udhith\nRole: Python Engineer\n-----------------------\n'''\nprint(card)",
            output: "--- STUDENT PROFILE ---\nName: Udhith\nRole: Python Engineer\n-----------------------"
          }
        ]
      },
      {
        slug: "variables-dynamic-typing",
        name: "Variables & Dynamic Typing",
        careerNote: "Python is dynamically typed: variable names are references pointing to objects in memory. Essential for clean memory management.",
        tutorialEn: "In Python, variables are created when you assign a value to them (`x = 10`). You do not declare variable types like `int` or `String`. Python dynamically determines the type at runtime.",
        tutorialTanglish: "Python-la variable create panna `let`, `var`, `int` poda thevailla. Direct-aa `x = 10` nu assign pannalaam. Python automatically adhoda type-ai decide pannikkum. Variable name underscore (_) illa letter-la start aaganum.",
        tutorialTamil: "பைத்தானில் மாறிகளுக்கு தரவு வகையைக் குறிப்பிட தேவையில்லை. மதிப்பு ஒதுக்கப்படும் போது அது தானாகவே வகையைத் தீர்மானிக்கும்.",
        keywords: [
          { term: "Dynamic Typing", tanglish: "Data type-ai munnadiye declare pannama runtime-la decide pandra feature." },
          { term: "Memory Reference", tanglish: "Variable name oru memory address-la irukkura object-ai point pannudhu." },
          { term: "Assignment Operator", tanglish: "`=` symbol use panni right side value-ai left side variable-ku podradhu." }
        ],
        codeExamples: [
          {
            title: "Dynamic Variable Reassignment",
            code: "x = 42          # x is an int\nprint(type(x))\nx = 'thanglish' # x is now a str\nprint(type(x))",
            output: "<class 'int'>\n<class 'str'>"
          }
        ]
      },
      {
        slug: "core-data-types",
        name: "Core Data Types (int, float, str, bool)",
        careerNote: "All API payloads and database records map directly to Python's primitive types. Understanding precision prevents calculation bugs.",
        tutorialEn: "Python has four foundational scalar data types: `int` for whole numbers, `float` for decimals, `str` for text (enclosed in quotes), and `bool` for `True` or `False`. Strings in Python are immutable.",
        tutorialTanglish: "Python-la 4 basic types irukku: `int` (muzhukka numbers), `float` (decimal numbers like 3.14), `str` (quotes-la irukkura text), `bool` (`True` or `False`). Strings-ai change panna mudiyaadhu (immutable).",
        tutorialTamil: "முழு எண்கள் (int), பதின்ம எண்கள் (float), உரை (str), மற்றும் பூலியன் (bool) ஆகியவை பைத்தானின் அடிப்படை தரவு வகைகள்.",
        keywords: [
          { term: "Immutability", tanglish: "Create pannadhukku apram internal value-ai maatha mudiyadhadhu (like strings, tuples)." },
          { term: "Boolean Truth Value", tanglish: "`True` or `False` mattum vechirukkura logic conditions." },
          { term: "Type Checking", tanglish: "`type(var)` function use panni variable oda type enna-nu paakuradhu." }
        ],
        codeExamples: [
          {
            title: "Inspecting Data Types",
            code: "age = 22\nrating = 4.8\nis_active = True\nname = 'Kavi'\nprint(type(age), type(rating), type(is_active))",
            output: "<class 'int'> <class 'float'> <class 'bool'>"
          }
        ]
      },
      {
        slug: "type-casting-input",
        name: "Type Casting & input() Function",
        careerNote: "Handling user forms, web inputs, and command-line arguments always produces strings. Safe type conversion is mandatory.",
        tutorialEn: "`input()` always captures terminal input as a string (`str`). To perform arithmetic on user inputs, you must explicitly cast the string to `int()` or `float()`. Converting invalid strings raises `ValueError`.",
        tutorialTanglish: "`input()` function eppovum input-ai string (`str`)-aa thaan vaangum. Number-aa use panna `int(input())` or `float(input())` pottu type cast pannanum. Illana string concatenation nadandhudum.",
        tutorialTamil: "`input()` செயல்பாடு எப்பொழுதும் உரையை (string) மட்டுமே பெறும். எண்களாக மாற்ற `int()` அல்லது `float()` பயன்படுத்த வேண்டும்.",
        keywords: [
          { term: "Type Casting", tanglish: "Oru data type-la irundhu innoru data type-ku maathradhu (eg: str -> int)." },
          { term: "ValueError", tanglish: "'hello' maadhiri text-ai int-aa convert panna try pannumbodhu vara error." }
        ],
        codeExamples: [
          {
            title: "Safe Conversion of Input",
            code: "# Converting string to integer safely\nraw_score = '95'\nscore = int(raw_score)\nprint(score + 5)",
            output: "100"
          }
        ]
      },
      {
        slug: "comments-indentation-rules",
        name: "Comments & Indentation Rules",
        careerNote: "PEP 8 clean indentation is the most basic code review expectation in software jobs. Eliminates IndentationError.",
        tutorialEn: "Python uses 4 spaces of indentation to denote blocks of code (inside `if`, `for`, `def`). Never mix tabs and spaces. Comments start with `#` and are ignored by Python.",
        tutorialTanglish: "Python-la curly braces `{}` kedayadhu. Edhukku pathila 4 spaces indentation use pannanum. Tabs and spaces-ai mix panna koodadhu. `#` pottu comment ezhudhalaam.",
        tutorialTamil: "பைத்தானில் வரிகளை ஒழுங்குபடுத்த 4 இடைவெளிகள் (indentation) பயன்படுத்தப்படுகின்றன.",
        keywords: [
          { term: "PEP 8", tanglish: "Python community ezhudhiya official clean code style guide." },
          { term: "IndentationError", tanglish: "Block ulla 4 spaces gap thappa irundha vara error." }
        ],
        codeExamples: [
          {
            title: "Proper PEP 8 Indentation Block",
            code: "x = 10\nif x > 5:\n    # Indented by exactly 4 spaces\n    print('x is greater than 5')",
            output: "x is greater than 5"
          }
        ]
      }
    ]
  },
  {
    moduleId: 2,
    moduleName: "Module 2: Operators & Expressions",
    topics: [
      {
        slug: "arithmetic-modulo-logic",
        name: "Arithmetic & Modulo Logic",
        careerNote: "Used in pagination, hash buckets, odd/even checks, and financial calculations.",
        tutorialEn: "Python offers addition (`+`), subtraction (`-`), multiplication (`*`), true division (`/`), floor division (`//`), remainder modulo (`%`), and exponentiation (`**`). Division (`/`) always returns a float.",
        tutorialTanglish: "`/` eppovum float tharum (5 / 2 = 2.5). `//` floor division panni round down integer tharum (5 // 2 = 2). `%` remainder tharum (5 % 2 = 1). `**` power/exponent calculate pannum (2 ** 3 = 8).",
        tutorialTamil: "கூட்டல், கழித்தல், பெருக்கல் மற்றும் வகுத்தலுடன், `//` முழு எண் வகுத்தலையும் `%` மீதியையும் தருகிறது.",
        keywords: [
          { term: "Floor Division", tanglish: "Decimal points edukkaama lower integer-ai mattum thara division (`//`)." },
          { term: "Modulo Operator", tanglish: "Vaguthalukku apram meedhi irukkura remainder-ai thara symbol (`%`)." }
        ],
        codeExamples: [
          {
            title: "Floor Division vs Regular Division",
            code: "print('Regular / :', 7 / 2)\nprint('Floor //   :', 7 // 2)\nprint('Modulo %   :', 7 % 2)\nprint('Power **   :', 2 ** 4)",
            output: "Regular / : 3.5\nFloor //   : 3\nModulo %   : 1\nPower **   : 16"
          }
        ]
      },
      {
        slug: "comparison-operators",
        name: "Comparison & Relational Operators",
        careerNote: "Writing chained boolean comparisons without nested conditions keeps business logic clean and readable.",
        tutorialEn: "Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) evaluate expressions to boolean `True` or `False`. Python allows chained comparisons like `18 <= age < 65`.",
        tutorialTanglish: "`==` equality check pannum, `!=` not equal check pannum. Python-la `10 < x < 50` nu chain panni direct-aa ezhudhalaam.",
        tutorialTamil: "மதிப்புகளை ஒப்பிட்டு True அல்லது False தரும் குறியீடுகள்.",
        keywords: [
          { term: "Equality (==)", tanglish: "Rendu values equal-aa irukka-nu compare pandradhu." },
          { term: "Chained Comparison", tanglish: "`10 < x <= 20` nu single line-la range check pandradhu." }
        ],
        codeExamples: [
          {
            title: "Chained Comparison in Python",
            code: "score = 85\nis_distinction = 80 <= score <= 100\nprint('Distinction?', is_distinction)",
            output: "Distinction? True"
          }
        ]
      },
      {
        slug: "logical-short-circuiting",
        name: "Logical Operators & Short-Circuiting",
        careerNote: "Short-circuiting (`and`, `or`, `not`) avoids unnecessary database queries and protects against null pointer errors.",
        tutorialEn: "`and` returns `True` only if both sides are true. `or` returns `True` if at least one side is true. Python evaluates lazily: if the left side of `or` is true, the right side is not even executed.",
        tutorialTanglish: "`and` rendu side-um True-aa irukkanum. `or` edhaavadhu oru side True-aa irundha pothum. Python lazy-aa evaluate pannum: `or`-la first value True-na second check pannave pannadhu (short-circuit).",
        tutorialTamil: "தர்க்கக் குறியீடுகள்: `and`, `or`, `not`. இவை நிபந்தனைகளை ஒருங்கிணைக்க பயன்படுகின்றன.",
        keywords: [
          { term: "Short-Circuit Evaluation", tanglish: "Condition thevaiyillaama poita second part-ai execute pannama skip pandradhu." },
          { term: "Truthy & Falsy", tanglish: "0, '', [], None ellaam Falsy values. Matha values Truthy." }
        ],
        codeExamples: [
          {
            title: "Short-Circuit Safeguard",
            code: "user = {'role': 'developer'}\n# Safe lookup: if 'role' in user and user['role'] == 'developer'\nprint('Access granted:', 'role' in user and user['role'] == 'developer')",
            output: "Access granted: True"
          }
        ]
      },
      {
        slug: "assignment-operators",
        name: "Assignment & Augmented Operators",
        careerNote: "In-place modifications (`+=`, `-=`, `*=`) optimize accumulator logic and variable tracking in production code.",
        tutorialEn: "Augmented assignment operators like `+=`, `-=`, `*=`, `/=` modify variables in place (`x += 1` is shorthand for `x = x + 1`).",
        tutorialTanglish: "`x += 5` sonna `x = x + 5` ku samam. Idhai augmented assignment nu solvom. Code compact-aa and fast-aa run aagum.",
        tutorialTamil: "மதிப்புகளை சுருக்கமாக மாற்றியமைக்கும் குறியீடுகள் (எ.கா. `x += 1`).",
        keywords: [
          { term: "In-place Mutation", tanglish: "Pudhu variable create pannama adhe variable-la value-ai update pandradhu." }
        ],
        codeExamples: [
          {
            title: "Accumulating Total with +=",
            code: "total = 100\ntotal += 25\ntotal *= 2\nprint('Final Total:', total)",
            output: "Final Total: 250"
          }
        ]
      },
      {
        slug: "identity-membership-precedence",
        name: "Identity (is) vs Membership (in) & Precedence",
        careerNote: "Classic Python interview trap: `==` checks value equality, whereas `is` checks memory reference identity.",
        tutorialEn: "`==` tests whether values are equivalent. `is` checks whether two variables refer to the exact same object in memory (`id(a) == id(b)`). Always use `is None` to check for `None`. The `in` operator tests for membership in collections.",
        tutorialTanglish: "`==` value same-aa irukka nu check pannum. `is` memory-la adhe address-la irukka nu check pannum. None check panna eppovum `if x is None:` nu use pannanum.",
        tutorialTamil: "`==` மதிப்புகளை சரிபார்க்கும், `is` நினைவக அடையாளத்தை (memory) சரிபார்க்கும்.",
        keywords: [
          { term: "Object Identity (`is`)", tanglish: "Memory address same-aa irukka nu check pandradhu." },
          { term: "Membership (`in`)", tanglish: "List or string ulla indha element irukka nu check pandradhu." }
        ],
        codeExamples: [
          {
            title: "Difference between == and is",
            code: "list1 = [1, 2, 3]\nlist2 = [1, 2, 3]\nprint('Value == :', list1 == list2) # True\nprint('Identity is :', list1 is list2) # False (different memory addresses)",
            output: "Value == : True\nIdentity is : False"
          }
        ]
      }
    ]
  },
  {
    moduleId: 3,
    moduleName: "Module 3: Control Flow & Loops",
    topics: [
      {
        slug: "if-elif-else-decisions",
        name: "if / elif / else Decision Making",
        careerNote: "Foundational branching logic for API routing, validation checks, and business rules.",
        tutorialEn: "Python executes conditional branches using `if`, `elif` (else if), and `else`. Once a condition evaluates to `True`, Python executes its block and skips the rest.",
        tutorialTanglish: "`if` condition True-aa irundha ulla pogum. Illana adutha `elif`-ai check pannum. Edhum match aagalana kadaisiya `else` block execute aagum.",
        tutorialTamil: "நிபந்தனைகளின் அடிப்படையில் குறியீட்டை இயக்க `if`, `elif`, `else` உதவுகின்றன.",
        keywords: [
          { term: "Branching", tanglish: "Conditions poruthu program execution path maari poradhu." },
          { term: "Guard Clause", tanglish: "Error vandha function start-laye return panni exit pandra best practice." }
        ],
        codeExamples: [
          {
            title: "Grading Decision Tree",
            code: "marks = 78\nif marks >= 90:\n    grade = 'A'\nelif marks >= 75:\n    grade = 'B'\nelse:\n    grade = 'C'\nprint('Grade:', grade)",
            output: "Grade: B"
          }
        ]
      },
      {
        slug: "nested-conditionals",
        name: "Nested Conditionals & Real-World Validation",
        careerNote: "Authentication, permission checks, and e-commerce checkout logic rely on robust multi-level conditional testing.",
        tutorialEn: "Conditionals can be nested inside one another. However, deeply nested ifs hurt readability. Senior developers refactor deeply nested conditions using guard clauses and logical `and`.",
        tutorialTanglish: "Oru `if` ulla innoru `if` podradhai nested if nu solvom. Aana romba depth-aa nested if podama `and` use panni clean-aa vachukiradhu industry standard.",
        tutorialTamil: "ஒரு நிபந்தனைக்குள் மற்றொரு நிபந்தனையை அமைத்தல்.",
        keywords: [
          { term: "Refactoring", tanglish: "Code logic maathama readability and structure-ai improve pandradhu." }
        ],
        codeExamples: [
          {
            title: "Clean Guard Validation",
            code: "logged_in = True\nis_admin = True\nif logged_in and is_admin:\n    print('Admin Console Unlocked!')",
            output: "Admin Console Unlocked!"
          }
        ]
      },
      {
        slug: "for-loops-range",
        name: "for Loops & range() Sequences",
        careerNote: "Iterating through lists, database rows, and generating numeric intervals is the lifeblood of backend engineering.",
        tutorialEn: "`for` loops in Python iterate over items of any sequence (a list, a tuple, or a string). The `range(start, stop, step)` function generates integer arithmetic progressions without creating a full list in memory.",
        tutorialTanglish: "Python `for` loop items-ai direct-aa iterate pannum (`for item in list`). `range(start, stop, step)` function numbers sequence generate pannum. Stop index eppovum include aagadhu (exclusive).",
        tutorialTamil: "வரிசையாக உள்ள தரவுகளை ஒவ்வொன்றாக அணுக `for` சுழற்சி பயன்படுகிறது.",
        keywords: [
          { term: "Iteration", tanglish: "Collection-la irukkura ovvoru element-aiyum thodarchiya execute pandradhu." },
          { term: "range() Step", tanglish: "Ovvoru jump-kum evvalavu gap irukkanum (eg: range(0, 10, 2) => 0, 2, 4, 6, 8)." }
        ],
        codeExamples: [
          {
            title: "range() with Step Interval",
            code: "for n in range(2, 9, 2):\n    print(n, end=' ')\nprint()",
            output: "2 4 6 8 "
          }
        ]
      },
      {
        slug: "while-loops-control",
        name: "while Loops, break, continue & pass",
        careerNote: "Managing polling loops, socket connections, and retry mechanisms requires mastery of break and continue.",
        tutorialEn: "A `while` loop continues executing as long as its condition remains `True`. `break` immediately terminates the loop. `continue` skips the remainder of the current iteration. `pass` is a null statement placeholder.",
        tutorialTanglish: "`while` condition True-aa irukkura varaikkum thodarnthu run aagum. `break` loop-ai udane stop panni veliya varum. `continue` indha iteration-ai skip panni next iteration-ku pogum.",
        tutorialTamil: "நிபந்தனை உண்மையாக இருக்கும் வரை மீண்டும் மீண்டும் இயங்க `while` பயன்படுகிறது.",
        keywords: [
          { term: "Infinite Loop", tanglish: "Condition eppovum True-aa irundhu loop mudiyama povaara dangerous bug." },
          { term: "Sentinel Value", tanglish: "Loop mudiyuradhukku signal thara oru special value." }
        ],
        codeExamples: [
          {
            title: "Using break and continue",
            code: "count = 0\nwhile count < 6:\n    count += 1\n    if count == 3:\n        continue # skip 3\n    if count == 5:\n        break    # stop at 5\n    print(count, end=' ')\nprint()",
            output: "1 2 4 "
          }
        ]
      },
      {
        slug: "nested-loops-patterns",
        name: "Nested Loops & Pattern Logic",
        careerNote: "Analyzing time complexity and matrix traversals in technical coding interviews.",
        tutorialEn: "A loop inside another loop is a nested loop. The inner loop executes all its iterations for every single iteration of the outer loop, resulting in O(N × M) operations.",
        tutorialTanglish: "Oru loop ulla innoru loop podradhu nested loop. Outer loop 1 round nadakkumbodhu inner loop full-aa complete aagum. 2D arrays, grids, patterns-ku idhu thevai.",
        tutorialTamil: "ஒரு சுழற்சிக்குள் மற்றொரு சுழற்சி (nested loop).",
        keywords: [
          { term: "Time Complexity (O(N^2))", tanglish: "Outer N times, inner N times run aagi operations N * N aaguradhu." }
        ],
        codeExamples: [
          {
            title: "Grid Coordinates Traversal",
            code: "for row in range(2):\n    for col in range(3):\n        print(f'({row},{col})', end=' ')\n    print()",
            output: "(0,0) (0,1) (0,2) \n(1,0) (1,1) (1,2) "
          }
        ]
      }
    ]
  }
];

export default function LearnTopics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, setLanguage, compareMode, toggleCompareMode, languages } = useLanguage();
  const { openPlayground } = useCodePlayground();

  const [searchTerm, setSearchTerm] = useState('');
  const [topicQuestions, setTopicQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  // Flatten all topics across modules
  const allTopics = useMemo(() => {
    const list = [];
    CURRICULUM_DATA.forEach(mod => {
      mod.topics.forEach(t => {
        list.push({ ...t, moduleId: mod.moduleId, moduleName: mod.moduleName });
      });
    });
    return list;
  }, []);

  // Determine active topic from query or default to first
  const activeSlug = searchParams.get('topic') || allTopics[0]?.slug;
  const currentTopic = useMemo(() => {
    return allTopics.find(t => t.slug === activeSlug) || allTopics[0];
  }, [allTopics, activeSlug]);

  const currentIndex = allTopics.findIndex(t => t.slug === currentTopic?.slug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  // Filter topics in sidebar
  const filteredModules = useMemo(() => {
    if (!searchTerm.trim()) return CURRICULUM_DATA;
    const term = searchTerm.toLowerCase();

    return CURRICULUM_DATA.map(mod => {
      const matched = mod.topics.filter(t => 
        t.name.toLowerCase().includes(term) || t.slug.toLowerCase().includes(term)
      );
      return { ...mod, topics: matched };
    }).filter(mod => mod.topics.length > 0);
  }, [searchTerm]);

  // Fetch practice questions for current topic
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      if (!currentTopic) return;
      setLoadingQuestions(true);
      try {
        // Fetch questions from backend
        const topicsList = await questionService.getTopics();
        const matched = topicsList.find(t => t.slug === currentTopic.slug || t.name.toLowerCase() === currentTopic.name.toLowerCase());
        const topicId = matched ? matched.id : null;

        const res = await questionService.getQuestions({ topicId, limit: 20 });
        if (isMounted) {
          setTopicQuestions(res || []);
        }
      } catch (err) {
        console.error("Failed to load topic questions", err);
      } finally {
        if (isMounted) setLoadingQuestions(false);
      }
    }

    loadQuestions();
    return () => { isMounted = false; };
  }, [currentTopic]);

  const handleSelectTopic = (slug) => {
    setSearchParams({ topic: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSubmit = async (payload) => {
    const qid = payload.question_id;
    setSubmittedAnswers(prev => ({ ...prev, [qid]: payload }));
    try {
      const res = await questionService.evaluateAnswer(payload);
      setFeedbacks(prev => ({ ...prev, [qid]: res }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTryCode = (code, title) => {
    openPlayground({
      code,
      title: `${currentTopic.name}: ${title}`,
      context: currentTopic.moduleName
    });
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--bg-paper)', minHeight: 'calc(100vh - 68px)' }}>
      {/* Top Banner & W3Schools Breadcrumbs */}
      <div style={{
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-white)',
        padding: '0.85rem 1.5rem',
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {/* Breadcrumb path */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-olive)' }}>
            <span style={{ fontWeight: 600 }}>Python Curriculum</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-forest)', fontWeight: 600 }}>{currentTopic?.moduleName?.split(':')[0]}</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-forest)', fontWeight: 700 }}>{currentTopic?.name}</span>
          </div>

          {/* Quick Header Controls: Compare Mode + Code Playground */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={toggleCompareMode}
              className={`btn btn-sm ${compareMode ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}
              title="Toggle side-by-side English & Tanglish comparison"
            >
              <SplitSquareVertical size={14} />
              <span>{compareMode ? 'Comparing ON' : 'Compare English'}</span>
            </button>

            <button
              onClick={() => openPlayground({
                code: currentTopic?.codeExamples?.[0]?.code || '# Practice Python code here\n',
                title: currentTopic?.name,
                context: 'Topic Sandbox'
              })}
              className="btn btn-secondary btn-sm"
              style={{
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-olive)',
                fontSize: '0.8rem',
                padding: '0.3rem 0.75rem'
              }}
            >
              <Terminal size={14} />
              <span>🐍 Open Code Editor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column W3Schools Layout */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 310px) 1fr',
        gap: '2rem',
        padding: '2rem 1.5rem 5rem',
        boxSizing: 'border-box'
      }} className="w3schools-layout">
        
        {/* ── Left Sidebar Curriculum (Sticky) ── */}
        <aside style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          height: 'fit-content',
          position: 'sticky',
          top: '84px',
          maxHeight: 'calc(100vh - 105px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Sidebar Search */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={15} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-olive)'
            }} />
            <input
              type="text"
              placeholder="Filter topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.1rem',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-paper)'
              }}
            />
          </div>

          {/* Curriculum Modules Tree */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '0.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {filteredModules.map((mod) => (
              <div key={mod.moduleId}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: 'var(--text-olive)',
                  letterSpacing: '0.04em',
                  marginBottom: '0.45rem',
                  paddingLeft: '0.4rem',
                }}>
                  {mod.moduleName}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {mod.topics.map((t) => {
                    const isSelected = t.slug === currentTopic?.slug;
                    return (
                      <button
                        key={t.slug}
                        onClick={() => handleSelectTopic(t.slug)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          padding: '0.45rem 0.65rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: isSelected ? 'var(--text-forest)' : 'transparent',
                          color: isSelected ? '#ffffff' : 'var(--text-forest)',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          transition: 'all var(--transition-fast)',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: isSelected ? 'var(--bg-sage)' : 'var(--text-olive)',
                            flexShrink: 0
                          }} />
                          <span style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {t.name}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={13} style={{ color: 'var(--bg-sage)', flexShrink: 0 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main Topic Content Area ── */}
        <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Topic Header Card */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                {currentTopic?.moduleName?.split(':')[0]}
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-paper)' }}>
                Topic {currentIndex + 1} of {allTopics.length}
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-forest)',
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
              lineHeight: 1.25
            }}>
              {currentTopic?.name}
            </h1>

            {/* Career Relevance Callout */}
            {currentTopic?.careerNote && (
              <div style={{
                backgroundColor: 'var(--bg-sage)',
                borderLeft: '4px solid var(--text-forest)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                fontSize: '0.88rem',
                color: 'var(--text-forest)',
                lineHeight: 1.55,
              }}>
                <Briefcase size={18} style={{ color: 'var(--text-forest)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Workplace & Interview Relevance:</strong> {currentTopic.careerNote}
                </div>
              </div>
            )}
          </div>

          {/* Concept Explanation with Side-by-Side Comparison */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-forest)' }}>
                Concept Tutorial
              </div>

              {/* Language switcher for tutorial */}
              <div className="lang-switcher">
                {languages.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`lang-btn ${language === l.id ? 'active' : ''}`}
                    style={{ fontSize: l.id === 'ta' ? '0.82rem' : '0.76rem', padding: '0.25rem 0.55rem' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Comparison Cards */}
            {compareMode && language !== 'english' ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                {/* Left: ENGLISH (ORIGINAL) */}
                <div style={{
                  backgroundColor: '#F2F4EE',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--text-olive)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em'
                  }}>
                    ENGLISH (ORIGINAL)
                  </div>
                  <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: 'var(--text-forest)' }}>
                    {currentTopic?.tutorialEn}
                  </p>
                </div>

                {/* Right: TANGLISH or TAMIL */}
                <div style={{
                  backgroundColor: 'var(--bg-sage)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: '4px solid var(--text-forest)',
                  borderTop: '1px solid var(--border-olive)',
                  borderRight: '1px solid var(--border-olive)',
                  borderBottom: '1px solid var(--border-olive)'
                }}>
                  <div style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--text-forest)',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em'
                  }}>
                    {language === 'tanglish' ? 'TANGLISH (SPOKEN TAMIL IN ENGLISH)' : 'TAMIL (தமிழ்)'}
                  </div>
                  <p className={language === 'ta' ? 'font-tamil' : ''} style={{
                    fontSize: '1rem',
                    lineHeight: 1.75,
                    color: 'var(--text-forest)',
                    fontWeight: 500
                  }}>
                    {language === 'tanglish' ? currentTopic?.tutorialTanglish : currentTopic?.tutorialTamil}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--bg-paper)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--text-forest)',
                marginBottom: '1.5rem'
              }}>
                <p className={language === 'ta' ? 'font-tamil' : ''} style={{
                  fontSize: '1.02rem',
                  lineHeight: 1.75,
                  color: 'var(--text-forest)'
                }}>
                  {language === 'english' ? currentTopic?.tutorialEn : 
                   language === 'tanglish' ? currentTopic?.tutorialTanglish : currentTopic?.tutorialTamil}
                </p>
              </div>
            )}

            {/* Workplace & Interview English Keywords Box */}
            {currentTopic?.keywords && currentTopic.keywords.length > 0 && (
              <div style={{
                backgroundColor: 'var(--surface-white)',
                border: '1.5px solid var(--border-olive)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                marginTop: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-forest)',
                  marginBottom: '0.85rem'
                }}>
                  <Sparkles size={16} />
                  <span>Workplace & Interview English Keywords</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {currentTopic.keywords.map((kw, i) => (
                    <div key={i} style={{
                      backgroundColor: 'var(--bg-paper)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-forest)', marginBottom: '0.2rem' }}>
                        {kw.term}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-olive)', lineHeight: 1.45 }}>
                        {kw.tanglish}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Code Examples ("Try It Yourself") */}
          {currentTopic?.codeExamples && (
            <div className="card" style={{
              backgroundColor: 'var(--surface-white)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-forest)', marginBottom: '1.25rem' }}>
                Interactive Code Examples (Try It Yourself)
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {currentTopic.codeExamples.map((ex, idx) => (
                  <div key={idx} style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    backgroundColor: '#18241E',
                    border: '1px solid rgba(120, 145, 122, 0.4)'
                  }}>
                    {/* Header bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 1.25rem',
                      backgroundColor: '#131D18',
                      borderBottom: '1px solid rgba(220, 232, 213, 0.1)',
                      fontSize: '0.82rem',
                      color: '#DCE8D5',
                      fontWeight: 600,
                    }}>
                      <span>{ex.title}</span>
                      <button
                        onClick={() => handleTryCode(ex.code, ex.title)}
                        className="btn btn-sm"
                        style={{
                          backgroundColor: 'var(--bg-sage)',
                          color: 'var(--text-forest)',
                          fontWeight: 700,
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.78rem',
                          borderRadius: 'var(--radius-sm)',
                          gap: '0.35rem'
                        }}
                      >
                        <Play size={13} fill="var(--text-forest)" />
                        <span>🐍 Try in Code Editor</span>
                      </button>
                    </div>

                    {/* Code */}
                    <pre style={{
                      margin: 0,
                      padding: '1.25rem',
                      color: '#DCE8D5',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      overflowX: 'auto'
                    }}>
                      <code>{ex.code}</code>
                    </pre>

                    {/* Expected Output block */}
                    {ex.output && (
                      <div style={{
                        backgroundColor: '#0F1713',
                        borderTop: '1px solid rgba(220, 232, 213, 0.1)',
                        padding: '0.75rem 1.25rem',
                        fontSize: '0.82rem',
                        color: '#84B892',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        <span style={{ color: '#78917A', display: 'block', marginBottom: '0.2rem', fontSize: '0.72rem' }}>OUTPUT:</span>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ex.output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrated Topic Practice Section (20 Questions for this topic) */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-forest)', marginBottom: '0.25rem' }}>
                  Practice What You Learned
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-olive)' }}>
                  Solve these structured questions on {currentTopic?.name} to lock in mastery.
                </p>
              </div>

              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-forest)',
                backgroundColor: 'var(--bg-sage)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-olive)'
              }}>
                {topicQuestions.length} Practice Questions Available
              </div>
            </div>

            {loadingQuestions ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid var(--bg-sage)',
                  borderTopColor: 'var(--text-forest)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <p style={{ color: 'var(--text-olive)' }}>Loading practice questions...</p>
              </div>
            ) : topicQuestions.length === 0 ? (
              <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--surface-white)' }}>
                <p style={{ color: 'var(--text-olive)' }}>Ready to practice? Switch to Practice tab or test code in the Playground.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {topicQuestions.slice(0, 5).map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onAnswerSubmit={handleAnswerSubmit}
                    submittedAnswer={submittedAnswers[q.id]}
                    feedback={feedbacks[q.id]}
                    showNextButton={false}
                  />
                ))}

                {topicQuestions.length > 5 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <button
                      onClick={() => navigate(`/practice?topic=${topicQuestions[0]?.topic_id}`)}
                      className="btn btn-primary"
                    >
                      <span>Solve All {topicQuestions.length} Questions for This Topic →</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Topic Navigation: Previous & Next Topic Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {prevTopic ? (
              <button
                onClick={() => handleSelectTopic(prevTopic.slug)}
                className="btn btn-secondary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <ChevronLeft size={16} />
                <span>Previous: {prevTopic.name}</span>
              </button>
            ) : <div />}

            {nextTopic && (
              <button
                onClick={() => handleSelectTopic(nextTopic.slug)}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.4rem' }}
              >
                <span>Next Topic: {nextTopic.name}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>

        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .w3schools-layout {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
            max-height: 380px !important;
          }
        }
      `}</style>
    </div>
  );
}
