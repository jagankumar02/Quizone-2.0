/* === DATA STORE: QUESTION BANK === */
// Compact structure to save space: [Subject, Topic, Difficulty, Question, [OptionA, B, C, D], CorrectIndex, Explanation]
const questionBankData = [
    // Computer Science
    ["Computer Science","Programming","Easy","What does HTML stand for?",["Hyper Text Markup Language","High Text Machine Language","Hyperloop Text Machine","None"],0,"HTML is the standard markup language for documents designed to be displayed in a web browser."],
    ["Computer Science","Programming","Easy","Which language is used for styling web pages?",["HTML","JQuery","CSS","XML"],2,"CSS (Cascading Style Sheets) is used to style and layout web pages."],
    ["Computer Science","Programming","Easy","What is the output of 2 + '2' in JavaScript?",["4","22","NaN","Error"],1,"In JS, the + operator concatenates a number and a string, resulting in '22'."],
    ["Computer Science","Database","Medium","Which SQL statement is used to extract data from a database?",["GET","EXTRACT","SELECT","OPEN"],2,"The SELECT statement is used to select data from a database."],
    ["Computer Science","Database","Medium","What does ACID stand for in databases?",["Atomicity, Consistency, Isolation, Durability","Array, Code, Int, Data","Asynchronous, Concurrent, Isolated, Document","None"],0,"ACID properties guarantee that database transactions are processed reliably."],
    ["Computer Science","Data Structures","Hard","Which sorting algorithm has the best average-case time complexity?",["Bubble Sort","Insertion Sort","Merge Sort","Selection Sort"],2,"Merge Sort has an average time complexity of O(n log n)."],
    ["Computer Science","Data Structures","Hard","What is the time complexity of searching in a balanced Binary Search Tree?",["O(1)","O(n)","O(log n)","O(n^2)"],2,"In a balanced BST, half the tree is eliminated at each step, yielding O(log n)."],
    // Mathematics
    ["Mathematics","Algebra","Easy","What is the value of x if 2x + 5 = 15?",["5","10","4","6"],0,"2x = 15 - 5 => 2x = 10 => x = 5."],
    ["Mathematics","Geometry","Easy","What is the area of a circle with radius r?",["2*pi*r","pi*r^2","pi*d","r^2"],1,"The area of a circle is calculated using the formula A = pi * r^2."],
    ["Mathematics","Trigonometry","Medium","What is the value of sin(90°)?",["0","1","-1","Undefined"],1,"The sine of a 90-degree angle in a right triangle is 1."],
    ["Mathematics","Calculus","Hard","What is the derivative of e^x?",["x*e^(x-1)","e^x","1/x","ln(x)"],1,"The exponential function e^x is unique because its derivative is itself."],
    ["Mathematics","Probability","Medium","What is the probability of rolling a 4 on a standard 6-sided die?",["1/4","1/2","1/6","1/3"],2,"There is one face with a 4 out of 6 possible outcomes, so 1/6."],
    // Physics
    ["Physics","Mechanics","Easy","What is the unit of force in the SI system?",["Joule","Newton","Watt","Pascal"],1,"Force is measured in Newtons (N) in the International System of Units."],
    ["Physics","Thermodynamics","Medium","Which law of thermodynamics states that energy cannot be created or destroyed?",["Zeroth","First","Second","Third"],1,"The First Law of Thermodynamics is the law of conservation of energy."],
    ["Physics","Electromagnetism","Hard","What is the speed of light in a vacuum?",["3 x 10^5 m/s","3 x 10^8 m/s","3 x 10^10 m/s","3 x 10^6 m/s"],1,"The speed of light in a vacuum is approximately 299,792,458 m/s, often approximated to 3 x 10^8 m/s."],
    // Chemistry
    ["Chemistry","Periodic Table","Easy","What is the chemical symbol for Gold?",["Ag","Au","Go","Gd"],1,"The symbol Au comes from the Latin word for gold, 'aurum'."],
    ["Chemistry","Organic","Medium","What is the main component of natural gas?",["Ethane","Propane","Methane","Butane"],2,"Methane (CH4) is the primary component of natural gas."],
    ["Chemistry","Physical","Hard","What is the pH of pure water at 25°C?",["0","7","14","1"],1,"Pure water is neutral, with a pH of exactly 7 at 25 degrees Celsius."],
    // English
    ["English","Grammar","Easy","Which of the following is a noun?",["Quickly","Happy","Dog","Run"],2,"A noun is a word that represents a person, place, thing, or idea. 'Dog' is a thing."],
    ["English","Vocabulary","Medium","What is a synonym for 'ubiquitous'?",["Rare","Omnipresent","Hidden","Expensive"],1,"Ubiquitous means present, appearing, or found everywhere."],
    // General Knowledge
    ["General Knowledge","History","Easy","Who was the first President of the United States?",["Abraham Lincoln","Thomas Jefferson","George Washington","John Adams"],2,"George Washington served as the first President from 1789 to 1797."],
    ["General Knowledge","Geography","Medium","Which is the largest ocean on Earth?",["Atlantic Ocean","Indian Ocean","Arctic Ocean","Pacific Ocean"],3,"The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."]
];

// Helper to expand compact data into objects
const questionBank = questionBankData.map(q => ({
    subject: q[0], topic: q[1], difficulty: q[2],
    question: q[3], options: q[4], correctIndex: q[5], explanation: q[6]
}));

/* === LOCAL STORAGE MANAGEMENT === */
const Storage = {
    KEYS: { USER: 'quizone_demo_user', ATTEMPTS: 'quizone_demo_attempts', PLANS: 'quizone_demo_plans', MATERIALS: 'quizone_demo_materials', BOOKMARKS: 'quizone_demo_bookmarks', CHATS: 'quizone_demo_chats' },
    get: (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; } },
    set: (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { UI.showToast("Storage error. Storage might be full.", "error"); } },
    remove: (key) => localStorage.removeItem(key),
    clearAll: () => { Object.values(Storage.KEYS).forEach(k => Storage.remove(k)); }
};

/* === GLOBAL STATE === */
const State = {
    user: null,
    activeQuiz: null,
    charts: {}
};

/* === UI UTILITIES === */
const UI = {
    showToast: (msg, type = 'success') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i> ${msg}`;
        container.appendChild(toast);
        lucide.createIcons({root: toast});
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
    },
    confirm: (title, message, onConfirm) => {
        const modal = document.getElementById('modal-overlay');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-message').textContent = message;
        modal.classList.remove('hidden');
        
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');
        
        const cleanUp = () => { modal.classList.add('hidden'); confirmBtn.replaceWith(confirmBtn.cloneNode(true)); cancelBtn.replaceWith(cancelBtn.cloneNode(true)); };
        
        cancelBtn.addEventListener('click', cleanUp);
        confirmBtn.addEventListener('click', () => { onConfirm(); cleanUp(); });
    }
};

/* === ROUTING & NAVIGATION === */
const app = {
    init: () => {
        lucide.createIcons();
        app.checkAuth();
        app.bindEvents();
    },
    checkAuth: () => {
        const user = Storage.get(Storage.KEYS.USER);
        if (user) {
            State.user = user;
            document.getElementById('auth-view').classList.add('hidden');
            document.getElementById('app-view').classList.remove('hidden');
            app.updateUserUI();
            app.navigate('dashboard');
        } else {
            document.getElementById('auth-view').classList.remove('hidden');
            document.getElementById('app-view').classList.add('hidden');
        }
    },
    updateUserUI: () => {
        const name = State.user.name || 'Student';
        const initials = name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('topbar-name').textContent = name;
        document.querySelector('.avatar').textContent = initials;
        document.getElementById('prof-avatar-display').textContent = initials;
        document.getElementById('prof-name-display').textContent = name;
        document.getElementById('prof-email-display').textContent = State.user.email;
        document.getElementById('dash-welcome').textContent = `Welcome back, ${name.split(' ')[0]}!`;
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dash-date').textContent = new Date().toLocaleDateString(undefined, options);
    },
    navigate: (viewId) => {
        document.querySelectorAll('.view').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        
        const viewEl = document.getElementById(`view-${viewId}`);
        if(viewEl) viewEl.classList.remove('hidden');
        
        const navEl = document.querySelector(`.nav-item[data-target="${viewId}"]`);
        if(navEl) {
            navEl.classList.add('active');
            document.getElementById('page-title').textContent = navEl.textContent.trim();
        }

        // View specific initializations
        if (viewId === 'dashboard') Dashboard.render();
        if (viewId === 'analytics') Analytics.render();
        if (viewId === 'my-quizzes') MyQuizzes.render();
        if (viewId === 'profile') Profile.render();
        if (viewId === 'planner') Planner.render();
        if (viewId === 'library') Library.render();
        if (viewId === 'bookmarks') Bookmarks.render();
        if (viewId === 'mock-tests') MockTests.render();
        if (viewId === 'study-assistant') Chat.render();
        
        if(window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
    },
    bindEvents: () => {
        // Auth Forms
        document.getElementById('show-signup').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('login-form').classList.add('hidden'); document.getElementById('signup-form').classList.remove('hidden'); });
        document.getElementById('show-login').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('signup-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden'); });
        
        document.getElementById('login-form').addEventListener('submit', Auth.login);
        document.getElementById('signup-form').addEventListener('submit', Auth.signup);
        document.getElementById('demo-login-btn').addEventListener('click', Auth.demoLogin);
        document.getElementById('logout-btn').addEventListener('click', Auth.logout);

        // Sidebar Navigation
        document.querySelectorAll('.nav-item[data-target]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                app.navigate(e.currentTarget.dataset.target);
            });
        });

        // Mobile Menu
        document.getElementById('mobile-menu-open').addEventListener('click', () => document.getElementById('sidebar').classList.add('open'));
        document.getElementById('mobile-menu-close').addEventListener('click', () => document.getElementById('sidebar').classList.remove('open'));

        // Settings Clear Data
        document.getElementById('btn-clear-data').addEventListener('click', () => {
            UI.confirm("Clear Demo Data", "This will permanently delete all your local progress. Continue?", () => {
                Storage.clearAll();
                location.reload();
            });
        });

        // Theme Toggle
        document.getElementById('theme-toggle').addEventListener('change', (e) => {
            if(e.target.checked) document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
            else document.body.style.filter = 'none';
        });
    }
};

/* === AUTH MODULE === */
const Auth = {
    login: (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        // Mock authentication
        let user = Storage.get(Storage.KEYS.USER);
        if(!user) user = { name: 'Student', email: email, course: 'General' };
        Storage.set(Storage.KEYS.USER, user);
        UI.showToast("Logged in successfully");
        app.checkAuth();
    },
    signup: (e) => {
        e.preventDefault();
        const pwd = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        if(pwd !== confirm) return UI.showToast("Passwords do not match", "error");
        
        const user = {
            name: document.getElementById('signup-name').value,
            email: document.getElementById('signup-email').value,
            college: document.getElementById('signup-college').value,
            course: document.getElementById('signup-course').value,
        };
        Storage.set(Storage.KEYS.USER, user);
        UI.showToast("Account created successfully");
        app.checkAuth();
    },
    demoLogin: () => {
        const demoUser = { name: "Demo Judge", email: "judge@hackathon.com", college: "Tech University", course: "Computer Science" };
        Storage.set(Storage.KEYS.USER, demoUser);
        
        // Populate some mock data if empty
        if(!Storage.get(Storage.KEYS.ATTEMPTS)) {
            const mockAttempts = [
                { id: Date.now()-100000, subject: "Computer Science", topic: "Programming", diff: "Easy", score: 80, correct: 4, total: 5, date: new Date(Date.now()-86400000).toISOString() },
                { id: Date.now()-50000, subject: "Mathematics", topic: "Algebra", diff: "Medium", score: 60, correct: 3, total: 5, date: new Date().toISOString() }
            ];
            Storage.set(Storage.KEYS.ATTEMPTS, mockAttempts);
        }
        UI.showToast("Logged in as Demo User");
        app.checkAuth();
    },
    logout: () => {
        State.user = null;
        Storage.remove(Storage.KEYS.USER); // Only clear session, keep demo data
        location.reload();
    }
};

/* === DASHBOARD MODULE === */
const Dashboard = {
    render: () => {
        const attempts = Storage.get(Storage.KEYS.ATTEMPTS) || [];
        const total = attempts.length;
        document.getElementById('stat-total-quizzes').textContent = total;
        
        if (total > 0) {
            const avg = Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / total);
            const best = Math.max(...attempts.map(a => a.score));
            document.getElementById('stat-avg-score').textContent = avg + '%';
            document.getElementById('stat-best-score').textContent = best + '%';
            
            // Render Recent Activity
            const recentList = document.getElementById('dash-recent-list');
            recentList.innerHTML = attempts.slice(-4).reverse().map(a => `
                <div class="recent-item">
                    <div>
                        <strong>${a.subject} - ${a.topic}</strong>
                        <div class="text-sm text-muted">${new Date(a.date).toLocaleDateString()} • ${a.diff}</div>
                    </div>
                    <span class="badge ${a.score >= 70 ? 'bg-mint' : (a.score >= 40 ? 'bg-accent' : 'bg-danger text-white')}">${a.score}%</span>
                </div>
            `).join('');
            
            Dashboard.renderChart(attempts);
        } else {
            document.getElementById('dash-recent-list').innerHTML = '<p class="text-muted">No recent activity. Generate a quiz to start!</p>';
        }

        const plans = Storage.get(Storage.KEYS.PLANS) || [];
        if(plans.length > 0) {
            const days = Math.ceil((new Date(plans[0].date) - new Date()) / (1000 * 60 * 60 * 24));
            document.getElementById('stat-exam-days').textContent = days > 0 ? `${days} Days` : 'Past/Today';
        }
    },
    renderChart: (attempts) => {
        const ctx = document.getElementById('dash-chart');
        if(!ctx) return;
        if(State.charts.dash) State.charts.dash.destroy();
        
        const recent = attempts.slice(-7);
        const labels = recent.map(a => new Date(a.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}));
        const data = recent.map(a => a.score);
        
        State.charts.dash = new Chart(ctx, {
            type: 'line',
            data: { labels, datasets: [{ label: 'Score %', data, borderColor: '#4059AD', backgroundColor: 'rgba(64, 89, 173, 0.1)', fill: true, tension: 0.4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });
    }
};

/* === QUIZ ENGINE === */
const Quiz = {
    init: () => {
        document.getElementById('qg-subject').addEventListener('change', Quiz.updateTopics);
        document.getElementById('quiz-gen-form').addEventListener('submit', Quiz.generate);
        
        // Active Quiz Listeners
        document.getElementById('qa-next').addEventListener('click', () => Quiz.navigate(1));
        document.getElementById('qa-prev').addEventListener('click', () => Quiz.navigate(-1));
        document.getElementById('qa-submit').addEventListener('click', Quiz.confirmSubmit);
        document.getElementById('qa-bookmark-btn').addEventListener('click', Quiz.bookmarkCurrent);
    },
    updateTopics: (e) => {
        const subj = e.target.value;
        const datalist = document.getElementById('qg-topic-list');
        const topics = [...new Set(questionBank.filter(q => q.subject === subj).map(q => q.topic))];
        datalist.innerHTML = topics.map(t => `<option value="${t}">`).join('');
    },
    generate: (e) => {
        e.preventDefault();
        const subject = document.getElementById('qg-subject').value;
        const topic = document.getElementById('qg-topic').value;
        const diff = document.getElementById('qg-difficulty').value;
        const count = parseInt(document.getElementById('qg-count').value);

        // Filter question bank
        let pool = questionBank.filter(q => q.subject === subject);
        if(pool.length === 0) return UI.showToast("No questions available for this subject in Demo.", "error");
        
        // Shuffle and select
        pool = pool.sort(() => 0.5 - Math.random()).slice(0, count);

        if(pool.length < count) {
            UI.showToast(`Found only ${pool.length} questions. Adjusting...`, "warning");
        }

        State.activeQuiz = {
            subject, topic, diff,
            questions: pool.map(q => ({...q, selectedAnswer: null})),
            currentIdx: 0,
            startTime: Date.now(),
            timer: null,
            duration: pool.length * 60 // 1 min per question
        };

        app.navigate('quiz-active');
        Quiz.startEngine();
    },
    startEngine: () => {
        const qz = State.activeQuiz;
        document.getElementById('qa-title').textContent = `${qz.subject} Practice`;
        document.getElementById('qa-meta').textContent = `${qz.subject} | ${qz.topic} | ${qz.diff}`;
        document.getElementById('qa-total-num').textContent = qz.questions.length;
        
        Quiz.renderPalette();
        Quiz.renderQuestion();
        
        // Start Timer
        let timeRemaining = qz.duration;
        const timerEl = document.getElementById('qa-timer');
        clearInterval(qz.timer);
        qz.timer = setInterval(() => {
            timeRemaining--;
            const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
            const s = (timeRemaining % 60).toString().padStart(2, '0');
            timerEl.textContent = `${m}:${s}`;
            if(timeRemaining <= 0) {
                clearInterval(qz.timer);
                Quiz.submit();
            }
        }, 1000);
    },
    renderPalette: () => {
        const qz = State.activeQuiz;
        const palette = document.getElementById('qa-palette');
        palette.innerHTML = qz.questions.map((q, i) => 
            `<button class="palette-btn ${q.selectedAnswer !== null ? 'answered' : ''} ${i === qz.currentIdx ? 'current' : ''}" 
                onclick="Quiz.goTo(${i})">${i+1}</button>`
        ).join('');
    },
    renderQuestion: () => {
        const qz = State.activeQuiz;
        const q = qz.questions[qz.currentIdx];
        document.getElementById('qa-current-num').textContent = qz.currentIdx + 1;
        document.getElementById('qa-question-text').textContent = q.question;
        
        const optsContainer = document.getElementById('qa-options');
        optsContainer.innerHTML = q.options.map((opt, i) => `
            <div class="option-card ${q.selectedAnswer === i ? 'selected' : ''}" onclick="Quiz.selectOption(${i})">
                <span class="badge bg-primary-light text-primary">${String.fromCharCode(65+i)}</span>
                <span>${opt}</span>
            </div>
        `).join('');

        document.getElementById('qa-prev').disabled = (qz.currentIdx === 0);
        document.getElementById('qa-next').innerHTML = qz.currentIdx === qz.questions.length - 1 ? 'Finish' : 'Next <i data-lucide="arrow-right"></i>';
        lucide.createIcons({root: document.getElementById('qa-next')});
    },
    selectOption: (idx) => {
        State.activeQuiz.questions[State.activeQuiz.currentIdx].selectedAnswer = idx;
        Quiz.renderQuestion();
        Quiz.renderPalette();
    },
    navigate: (dir) => {
        const qz = State.activeQuiz;
        if(dir === 1 && qz.currentIdx === qz.questions.length - 1) return Quiz.confirmSubmit();
        qz.currentIdx += dir;
        Quiz.renderQuestion();
        Quiz.renderPalette();
    },
    goTo: (idx) => {
        State.activeQuiz.currentIdx = idx;
        Quiz.renderQuestion();
        Quiz.renderPalette();
    },
    bookmarkCurrent: () => {
        const q = State.activeQuiz.questions[State.activeQuiz.currentIdx];
        let bms = Storage.get(Storage.KEYS.BOOKMARKS) || [];
        // Prevent dupes
        if(!bms.find(b => b.question === q.question)) {
            bms.push(q);
            Storage.set(Storage.KEYS.BOOKMARKS, bms);
            UI.showToast("Question bookmarked!");
        } else {
            UI.showToast("Already bookmarked", "warning");
        }
    },
    confirmSubmit: () => {
        const unans = State.activeQuiz.questions.filter(q => q.selectedAnswer === null).length;
        const msg = unans > 0 ? `You have ${unans} unanswered questions. Submit anyway?` : "Are you sure you want to submit?";
        UI.confirm("Submit Quiz", msg, Quiz.submit);
    },
    submit: () => {
        clearInterval(State.activeQuiz.timer);
        const qz = State.activeQuiz;
        let correct = 0, incorrect = 0, unans = 0;
        
        qz.questions.forEach(q => {
            if(q.selectedAnswer === null) unans++;
            else if(q.selectedAnswer === q.correctIndex) correct++;
            else incorrect++;
        });

        const total = qz.questions.length;
        const score = Math.round((correct / total) * 100);
        const timeTaken = Math.round((Date.now() - qz.startTime) / 1000);

        // Save Attempt
        const attempt = {
            id: Date.now(), subject: qz.subject, topic: qz.topic, diff: qz.diff,
            score, correct, incorrect, unans, total, timeTaken,
            date: new Date().toISOString(),
            details: qz.questions
        };
        const attempts = Storage.get(Storage.KEYS.ATTEMPTS) || [];
        attempts.push(attempt);
        Storage.set(Storage.KEYS.ATTEMPTS, attempts);

        // Render Results
        document.getElementById('qr-score').textContent = score + '%';
        document.getElementById('qr-message').textContent = score >= 80 ? "Outstanding!" : (score >= 50 ? "Good Effort!" : "Needs Practice");
        const m = Math.floor(timeTaken / 60); const s = timeTaken % 60;
        document.getElementById('qr-summary').textContent = `You scored ${correct} out of ${total} in ${m}m ${s}s.`;
        
        document.getElementById('qr-correct').textContent = correct;
        document.getElementById('qr-incorrect').textContent = incorrect;
        document.getElementById('qr-unanswered').textContent = unans;
        document.getElementById('qr-time').textContent = `${m}:${s.toString().padStart(2,'0')}`;

        // Render Review
        const reviewList = document.getElementById('qr-review-list');
        reviewList.innerHTML = qz.questions.map((q, i) => {
            let status = 'unanswered';
            if(q.selectedAnswer !== null) status = q.selectedAnswer === q.correctIndex ? 'correct' : 'incorrect';
            
            return `
            <div class="review-item border-l-4 ${status==='correct'?'border-success':(status==='incorrect'?'border-danger':'border-muted')}">
                <div class="review-q">Q${i+1}. ${q.question}</div>
                <div class="review-ans">
                    <span class="${status==='correct'?'text-success':(status==='incorrect'?'text-danger':'text-muted')}">
                        <i data-lucide="${status==='correct'?'check':(status==='incorrect'?'x':'minus')}"></i>
                        Your Answer: ${q.selectedAnswer !== null ? q.options[q.selectedAnswer] : 'Not Answered'}
                    </span>
                    ${status !== 'correct' ? `<span class="text-success"><i data-lucide="check-circle"></i> Correct Answer: ${q.options[q.correctIndex]}</span>` : ''}
                </div>
                <div class="review-exp"><strong>Explanation:</strong> ${q.explanation}</div>
            </div>`;
        }).join('');
        
        app.navigate('quiz-result');
        lucide.createIcons({root: document.getElementById('view-quiz-result')});
        State.activeQuiz = null; // Clear state
    }
};
Quiz.init();

/* === MODULES === */
const Analytics = {
    render: () => {
        const attempts = Storage.get(Storage.KEYS.ATTEMPTS) || [];
        if(attempts.length === 0) return; // Need empty state in real app

        let tCorrect = 0, tIncorrect = 0, tUnans = 0;
        let subData = {};
        
        attempts.forEach(a => {
            tCorrect += a.correct; tIncorrect += a.incorrect; tUnans += a.unans;
            if(!subData[a.subject]) subData[a.subject] = {total:0, sum:0};
            subData[a.subject].total++;
            subData[a.subject].sum += a.score;
        });

        // Accuracy Doughnut
        if(State.charts.acc) State.charts.acc.destroy();
        State.charts.acc = new Chart(document.getElementById('chart-accuracy'), {
            type: 'doughnut',
            data: { labels: ['Correct', 'Incorrect', 'Unanswered'], datasets: [{ data: [tCorrect, tIncorrect, tUnans], backgroundColor: ['#10b981', '#ef4444', '#cbd5e1'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Trend Line
        if(State.charts.trend) State.charts.trend.destroy();
        State.charts.trend = new Chart(document.getElementById('chart-trend'), {
            type: 'line',
            data: { labels: attempts.map((_, i) => `Q${i+1}`), datasets: [{ label: 'Score', data: attempts.map(a => a.score), borderColor: '#4059AD', tension: 0.3 }] },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Subject Bar
        const subs = Object.keys(subData);
        const avgs = subs.map(s => Math.round(subData[s].sum / subData[s].total));
        if(State.charts.subs) State.charts.subs.destroy();
        State.charts.subs = new Chart(document.getElementById('chart-subjects'), {
            type: 'bar',
            data: { labels: subs, datasets: [{ label: 'Avg Score', data: avgs, backgroundColor: '#6B9AC4' }] },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { max: 100, beginAtZero: true } } }
        });
    }
};

const MyQuizzes = {
    render: () => {
        const attempts = Storage.get(Storage.KEYS.ATTEMPTS) || [];
        const tbody = document.getElementById('history-table-body');
        if(attempts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No quizzes attempted yet.</td></tr>';
            return;
        }
        tbody.innerHTML = attempts.reverse().map(a => `
            <tr>
                <td>${new Date(a.date).toLocaleDateString()}</td>
                <td>${a.subject}</td>
                <td>${a.topic}</td>
                <td><span class="badge bg-secondary-light text-secondary">${a.diff}</span></td>
                <td><strong>${a.score}%</strong></td>
                <td><button class="btn btn-sm btn-outline" onclick="UI.showToast('Demo: Review view coming soon')">Review</button></td>
            </tr>
        `).join('');
    }
};

const Planner = {
    init: () => {
        document.getElementById('btn-new-plan').addEventListener('click', () => document.getElementById('planner-form-container').classList.remove('hidden'));
        document.getElementById('planner-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const plan = {
                id: Date.now(),
                exam: document.getElementById('plan-exam').value,
                subject: document.getElementById('plan-subject').value,
                date: document.getElementById('plan-date').value,
                hrs: document.getElementById('plan-hrs').value,
                topics: document.getElementById('plan-topics').value.split(',').map(t => ({name: t.trim(), done: false}))
            };
            let plans = Storage.get(Storage.KEYS.PLANS) || [];
            plans.push(plan);
            Storage.set(Storage.KEYS.PLANS, plans);
            document.getElementById('planner-form-container').classList.add('hidden');
            e.target.reset();
            Planner.render();
            UI.showToast("Study Plan Created!");
        });
    },
    render: () => {
        const plans = Storage.get(Storage.KEYS.PLANS) || [];
        const container = document.getElementById('plans-list');
        if(plans.length === 0) {
            container.innerHTML = '<div class="col-span-2 text-center text-muted p-4">No study plans created yet.</div>';
            return;
        }
        container.innerHTML = plans.map(p => {
            const done = p.topics.filter(t => t.done).length;
            const progress = Math.round((done / p.topics.length) * 100) || 0;
            return `
            <div class="card">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-lg text-primary">${p.exam}</h3>
                    <button class="icon-btn text-danger" onclick="Planner.delete(${p.id})"><i data-lucide="trash-2"></i></button>
                </div>
                <p class="text-sm text-muted mb-4">${p.subject} • ${new Date(p.date).toLocaleDateString()}</p>
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-1"><span>Progress</span><span>${progress}%</span></div>
                    <div class="progress-bar-container"><div class="progress-bar bg-primary" style="width: ${progress}%"></div></div>
                </div>
                <ul class="text-sm flex flex-col gap-2">
                    ${p.topics.map((t, i) => `
                        <li class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded" onclick="Planner.toggleTopic(${p.id}, ${i})">
                            <i data-lucide="${t.done ? 'check-square' : 'square'}" class="${t.done ? 'text-success' : 'text-muted'}"></i>
                            <span class="${t.done ? 'line-through text-muted' : ''}">${t.name}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>`;
        }).join('');
        lucide.createIcons({root: container});
    },
    toggleTopic: (planId, topicIdx) => {
        let plans = Storage.get(Storage.KEYS.PLANS);
        const plan = plans.find(p => p.id === planId);
        plan.topics[topicIdx].done = !plan.topics[topicIdx].done;
        Storage.set(Storage.KEYS.PLANS, plans);
        Planner.render();
    },
    delete: (id) => {
        let plans = Storage.get(Storage.KEYS.PLANS);
        plans = plans.filter(p => p.id !== id);
        Storage.set(Storage.KEYS.PLANS, plans);
        Planner.render();
    }
};
Planner.init();

const Library = {
    init: () => {
        document.getElementById('btn-add-material').addEventListener('click', () => document.getElementById('material-form-container').classList.remove('hidden'));
        document.getElementById('material-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const item = {
                id: Date.now(),
                title: document.getElementById('mat-title').value,
                subject: document.getElementById('mat-subject').value,
                category: document.getElementById('mat-cat').value,
                link: document.getElementById('mat-link').value,
                date: new Date().toISOString()
            };
            let mats = Storage.get(Storage.KEYS.MATERIALS) || [];
            mats.push(item);
            Storage.set(Storage.KEYS.MATERIALS, mats);
            document.getElementById('material-form-container').classList.add('hidden');
            e.target.reset();
            Library.render();
            UI.showToast("Material Added!");
        });
        document.getElementById('lib-search').addEventListener('input', Library.render);
    },
    render: () => {
        let mats = Storage.get(Storage.KEYS.MATERIALS) || [];
        const search = document.getElementById('lib-search').value.toLowerCase();
        if(search) mats = mats.filter(m => m.title.toLowerCase().includes(search) || m.subject.toLowerCase().includes(search));
        
        const container = document.getElementById('library-list');
        if(mats.length === 0) {
            container.innerHTML = '<div class="col-span-3 text-center text-muted p-4">No materials found.</div>';
            return;
        }
        
        container.innerHTML = mats.map(m => `
            <div class="card flex flex-col h-full">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <span class="badge bg-secondary-light text-secondary">${m.category}</span>
                        <button class="icon-btn text-danger py-0 px-1" onclick="Library.delete(${m.id})"><i data-lucide="trash-2" size="16"></i></button>
                    </div>
                    <h4 class="mb-1">${m.title}</h4>
                    <p class="text-sm text-muted">${m.subject}</p>
                </div>
                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                    <span class="text-xs text-muted">${new Date(m.date).toLocaleDateString()}</span>
                    <button class="btn btn-sm btn-outline py-1" onclick="UI.showToast('Demo: File access simulated')">Open</button>
                </div>
            </div>
        `).join('');
        lucide.createIcons({root: container});
    },
    delete: (id) => {
        let mats = Storage.get(Storage.KEYS.MATERIALS);
        Storage.set(Storage.KEYS.MATERIALS, mats.filter(m => m.id !== id));
        Library.render();
    }
};
Library.init();

const Bookmarks = {
    render: () => {
        const bms = Storage.get(Storage.KEYS.BOOKMARKS) || [];
        const container = document.getElementById('bookmarks-list');
        if(bms.length === 0) {
            container.innerHTML = '<p class="text-muted text-center py-4">No bookmarked questions yet.</p>';
            return;
        }
        container.innerHTML = bms.map((b, i) => `
            <div class="review-item relative">
                <button class="absolute top-2 right-2 icon-btn text-danger" onclick="Bookmarks.remove(${i})"><i data-lucide="trash-2"></i></button>
                <div class="text-sm text-muted mb-2">${b.subject} | ${b.topic} | ${b.difficulty}</div>
                <div class="review-q">${b.question}</div>
                <div class="text-success mb-2"><i data-lucide="check-circle" class="inline-icon" size="16"></i> Correct Answer: ${b.options[b.correctIndex]}</div>
                <div class="review-exp text-sm">${b.explanation}</div>
            </div>
        `).join('');
        lucide.createIcons({root: container});
    },
    remove: (idx) => {
        let bms = Storage.get(Storage.KEYS.BOOKMARKS);
        bms.splice(idx, 1);
        Storage.set(Storage.KEYS.BOOKMARKS, bms);
        Bookmarks.render();
    }
};

const MockTests = {
    render: () => {
        const tests = [
            { id: 1, title: "Midterm Prep: CS", subject: "Computer Science", q: 20, min: 30 },
            { id: 2, title: "Finals: Physics Mechanics", subject: "Physics", q: 25, min: 45 },
            { id: 3, title: "Math Basics Evaluator", subject: "Mathematics", q: 15, min: 20 }
        ];
        const container = document.getElementById('mock-test-list');
        container.innerHTML = tests.map(t => `
            <div class="card border-2 border-transparent hover:border-primary transition">
                <h3 class="text-lg mb-2">${t.title}</h3>
                <p class="text-muted text-sm mb-4">${t.subject}</p>
                <div class="flex gap-4 text-sm mb-4 bg-bg p-2 rounded">
                    <span class="flex items-center gap-1"><i data-lucide="file-question" size="16"></i> ${t.q} Qs</span>
                    <span class="flex items-center gap-1"><i data-lucide="timer" size="16"></i> ${t.min} Mins</span>
                </div>
                <button class="btn btn-primary btn-block" onclick="UI.showToast('Demo: Mock test environment initializing...')">Start Mock Test</button>
            </div>
        `).join('');
        lucide.createIcons({root: container});
    }
};

const Profile = {
    init: () => {
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const user = Storage.get(Storage.KEYS.USER);
            user.name = document.getElementById('prof-name').value;
            user.college = document.getElementById('prof-college').value;
            user.course = document.getElementById('prof-course').value;
            user.dept = document.getElementById('prof-dept').value;
            user.year = document.getElementById('prof-year').value;
            Storage.set(Storage.KEYS.USER, user);
            State.user = user;
            app.updateUserUI();
            UI.showToast("Profile updated successfully");
        });
    },
    render: () => {
        const user = State.user;
        document.getElementById('prof-name').value = user.name || '';
        document.getElementById('prof-email').value = user.email || '';
        document.getElementById('prof-college').value = user.college || '';
        document.getElementById('prof-course').value = user.course || '';
        document.getElementById('prof-dept').value = user.dept || '';
        document.getElementById('prof-year').value = user.year || '';
    }
};
Profile.init();

const Chat = {
    init: () => {
        document.getElementById('chat-form').addEventListener('submit', Chat.handleSend);
        document.getElementById('chat-clear-btn').addEventListener('click', Chat.clear);
        document.getElementById('chat-suggestions').addEventListener('click', (e) => {
            if(e.target.tagName === 'BUTTON') {
                document.getElementById('chat-input').value = e.target.textContent;
                Chat.handleSend(new Event('submit'));
            }
        });
    },
    render: () => {
        const chats = Storage.get(Storage.KEYS.CHATS) || [{role: 'bot', text: 'Hello! I am your AI Study Assistant. Ask me a question from the question bank topics!'}];
        const container = document.getElementById('chat-messages');
        container.innerHTML = chats.map(c => `
            <div class="message ${c.role}">
                ${c.role === 'bot' ? '<div class="bot-avatar bg-mint"><i data-lucide="bot" size="20"></i></div>' : ''}
                <div class="message-bubble">${c.text}</div>
            </div>
        `).join('');
        lucide.createIcons({root: container});
        container.scrollTop = container.scrollHeight;
    },
    handleSend: (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if(!text) return;
        
        let chats = Storage.get(Storage.KEYS.CHATS) || [];
        chats.push({role: 'user', text});
        Storage.set(Storage.KEYS.CHATS, chats);
        input.value = '';
        Chat.render();

        // Simulate Bot Typing
        setTimeout(() => {
            const reply = Chat.getBotResponse(text);
            chats.push({role: 'bot', text: reply});
            Storage.set(Storage.KEYS.CHATS, chats);
            Chat.render();
        }, 800);
    },
    getBotResponse: (text) => {
        const lower = text.toLowerCase();
        if(lower.includes('html')) return "HTML stands for Hyper Text Markup Language. It is the standard markup language for documents designed to be displayed in a web browser.";
        if(lower.includes('newton')) return "Newton's laws of motion are three basic laws of classical mechanics that describe the relationship between the motion of an object and the forces acting on it.";
        if(lower.includes('quadratic')) return "The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a. It is used to find the solutions to a quadratic equation ax² + bx + c = 0.";
        if(lower.includes('hello') || lower.includes('hi')) return "Hello! How can I help with your studies today?";
        return "That's a great question! As this is a demo environment, my knowledge base is limited to a few specific academic prompts. Try asking about HTML, Newton's Laws, or Quadratic Equations!";
    },
    clear: () => {
        Storage.remove(Storage.KEYS.CHATS);
        Chat.render();
    }
};
Chat.init();

// Boot application
document.addEventListener('DOMContentLoaded', app.init);