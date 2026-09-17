const FLUTTER_LESSONS = [
  {
    id: 'intro',
    title: 'Introduction to Flutter',
    description: 'Learn what Flutter is and why it is used.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Welcome to Flutter!</h2>
      <p class="mb-4 text-gray-700">Flutter is Google's UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.</p>
      <h3 class="text-xl font-semibold mb-2">Why Flutter?</h3>
      <ul class="list-disc pl-5 space-y-2 text-gray-700">
        <li><strong>Fast Development:</strong> Hot Reload changes your code in milliseconds.</li>
        <li><strong>Expressive UI:</strong> A rich set of fully-customizable widgets.</li>
        <li><strong>Native Performance:</strong> Code compiles directly to ARM machine code.</li>
      </ul>
    `,
    practice: {
      question: 'What is the main language used to write Flutter apps?',
      options: ['Java', 'Kotlin', 'Dart', 'Swift'],
      answer: 2
    }
  },
  {
    id: 'widgets',
    title: 'Everything is a Widget',
    description: 'Understand the core concept of Flutter UI.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Widgets</h2>
      <p class="mb-4 text-gray-700">In Flutter, almost everything is a widget. A widget is an immutable description of part of a user interface.</p>
      <h3 class="text-xl font-semibold mb-2">Stateless vs Stateful</h3>
      <p class="mb-2 text-gray-700"><b>StatelessWidget:</b> A widget that does not require mutable state (e.g., Icon, IconButton, Text).</p>
      <p class="mb-4 text-gray-700"><b>StatefulWidget:</b> A widget that has mutable state (e.g., Checkbox, Radio, Slider).</p>
    `,
    practice: {
      question: 'Which widget should you use if the UI can change dynamically based on user interaction?',
      options: ['StatelessWidget', 'StatefulWidget', 'StaticWidget', 'DynamicWidget'],
      answer: 1
    }
  },
  {
    id: 'layout',
    title: 'Building Layouts',
    description: 'Learn how to arrange widgets on the screen.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Layouts in Flutter</h2>
      <p class="mb-4 text-gray-700">Flutter provides a variety of widgets specifically for layout.</p>
      <h3 class="text-xl font-semibold mb-2">Row and Column</h3>
      <p class="mb-2 text-gray-700">Use <code>Row</code> to arrange widgets horizontally, and <code>Column</code> to arrange widgets vertically.</p>
      <p class="mb-4 text-gray-700">They use properties like <code>mainAxisAlignment</code> and <code>crossAxisAlignment</code> to align their children.</p>
      <h3 class="text-xl font-semibold mb-2">Stack</h3>
      <p class="mb-2 text-gray-700">Use <code>Stack</code> to overlay widgets on top of each other.</p>
    `,
    practice: {
      question: 'Which property aligns children along the primary axis of a Row or Column?',
      options: ['crossAxisAlignment', 'mainAxisAlignment', 'alignment', 'center'],
      answer: 1
    }
  },
  {
    id: 'state-management',
    title: 'State Management Basics',
    description: 'Learn how to manage data that changes over time.',
    content: `
      <h2 class="text-2xl font-bold mb-4">State Management</h2>
      <p class="mb-4 text-gray-700">State is information that can be read synchronously when the widget is built and might change during the lifetime of the widget.</p>
      <h3 class="text-xl font-semibold mb-2">setState</h3>
      <p class="mb-4 text-gray-700">The most basic way to manage state is by using a <code>StatefulWidget</code> and calling <code>setState()</code>. This tells Flutter to rebuild the UI with the updated data.</p>
      <h3 class="text-xl font-semibold mb-2">Advanced Approaches</h3>
      <p class="mb-4 text-gray-700">For larger apps, you will use packages like Provider, Riverpod, or BLoC to manage state globally across the application instead of passing data down the widget tree manually.</p>
    `,
    practice: {
      question: 'What method do you call to trigger a UI rebuild in a StatefulWidget?',
      options: ['updateUI()', 'refresh()', 'setState()', 'build()'],
      answer: 2
    }
  },
  {
    id: 'navigation',
    title: 'Navigation and Routing',
    description: 'Move between different screens in your app.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Navigation</h2>
      <p class="mb-4 text-gray-700">Most apps contain multiple screens (called "routes" in Flutter). You use the <code>Navigator</code> to move between them.</p>
      <h3 class="text-xl font-semibold mb-2">Push and Pop</h3>
      <ul class="list-disc pl-5 space-y-2 text-gray-700 mb-4">
        <li><strong>Navigator.push():</strong> Adds a new route to the stack, transitioning to a new screen.</li>
        <li><strong>Navigator.pop():</strong> Removes the current route from the stack, returning to the previous screen.</li>
      </ul>
      <h3 class="text-xl font-semibold mb-2">Named Routes</h3>
      <p class="mb-4 text-gray-700">For cleaner code, you can define routes in your <code>MaterialApp</code> and navigate using <code>Navigator.pushNamed()</code>.</p>
    `,
    practice: {
      question: 'Which method returns the user to the previous screen?',
      options: ['Navigator.back()', 'Navigator.pop()', 'Navigator.return()', 'Navigator.previous()'],
      answer: 1
    }
  },
  {
    id: 'forms-input',
    title: 'Handling User Input',
    description: 'Capture text and validate forms.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Forms and TextFields</h2>
      <p class="mb-4 text-gray-700">Handling text input securely and robustly is crucial for login screens, search bars, and data entry.</p>
      <h3 class="text-xl font-semibold mb-2">TextField</h3>
      <p class="mb-4 text-gray-700">The <code>TextField</code> widget is the most common way to get text input. You can read its value using an <code>onChange</code> callback or a <code>TextEditingController</code>.</p>
      <h3 class="text-xl font-semibold mb-2">Form Validation</h3>
      <p class="mb-4 text-gray-700">Wrap multiple <code>TextFormField</code> widgets in a <code>Form</code> widget. You can assign a <code>GlobalKey&lt;FormState&gt;</code> to the Form to validate all fields simultaneously.</p>
    `,
    practice: {
      question: 'Which object allows you to read the current value of a TextField on demand?',
      options: ['GlobalKey', 'TextEditingController', 'StringController', 'FormState'],
      answer: 1
    }
  },
  {
    id: 'networking',
    title: 'Networking and HTTP',
    description: 'Fetch data from the internet.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Fetching Data</h2>
      <p class="mb-4 text-gray-700">To interact with REST APIs, Flutter uses the <code>http</code> package.</p>
      <h3 class="text-xl font-semibold mb-2">Async / Await</h3>
      <p class="mb-4 text-gray-700">Network requests take time. Dart uses <code>Future</code>, <code>async</code>, and <code>await</code> to handle asynchronous operations without freezing the UI.</p>
      <h3 class="text-xl font-semibold mb-2">FutureBuilder</h3>
      <p class="mb-4 text-gray-700">To display data that arrives asynchronously, use the <code>FutureBuilder</code> widget. It automatically rebuilds itself based on the state of the Future (loading, success, or error).</p>
    `,
    practice: {
      question: 'Which widget helps you easily display data from an asynchronous network request?',
      options: ['AsyncWidget', 'NetworkBuilder', 'FutureBuilder', 'StreamBuilder'],
      answer: 2
    }
  },
  {
    id: 'animations',
    title: 'Animations Basics',
    description: 'Add life to your application with motion.',
    content: `
      <h2 class="text-2xl font-bold mb-4">Animations in Flutter</h2>
      <p class="mb-4 text-gray-700">Flutter's animation system is incredibly powerful, capable of running complex animations at 60 or 120 FPS.</p>
      <h3 class="text-xl font-semibold mb-2">Implicit Animations</h3>
      <p class="mb-4 text-gray-700">The easiest way to animate is using "Animated" versions of standard widgets, like <code>AnimatedContainer</code>, <code>AnimatedOpacity</code>, or <code>AnimatedPositioned</code>. Just change a value and call <code>setState()</code>; Flutter interpolates the transition.</p>
      <h3 class="text-xl font-semibold mb-2">Explicit Animations</h3>
      <p class="mb-4 text-gray-700">For more control (like looping, pausing, or reversing), use an <code>AnimationController</code> and <code>Tween</code>.</p>
    `,
    practice: {
      question: 'Which widget is best for a simple fade-in effect when a variable changes?',
      options: ['AnimationController', 'AnimatedOpacity', 'FadeInWidget', 'TweenAnimationBuilder'],
      answer: 1
    }
  }
];
