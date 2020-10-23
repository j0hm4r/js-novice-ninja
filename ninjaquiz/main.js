function random(a, b=1) {
    // if only 1 value is provide we need to swap a and b
    if (b === 1) {
        [a,b] = [b,a];
    }
    return Math.floor((b-a+1) * Math.random()) + a;
}

function shuffle(array) {
    for (let i = array.length; i; i--) {
        let j = random(i) - 1;
        [array[i-1], array[j]] = [array[j], array[i-1]];
    }
}

const quiz = [
    { name: "Superman", realName: "Clark Kent"},
    { name: "Wonder woman", realName: "Diana Prince"},
    { name: "Batman", realName: "Bruce Wayne"},
    { name: "Spiderman", realName: "Peter Parker"}
];

const view = {
    score: document.querySelector('#score strong'),
    question: document.getElementById('question'),
    result: document.getElementById('result'),
    info: document.getElementById('info'),
    start: document.getElementById('start'),
    response: document.querySelector('#response'),
    timer: document.querySelector('#timer strong'),
    setup() {
        this.show(this.question);
        this.show(this.response);
        this.show(this.result);
        this.hide(this.start);
        this.render(this.score, game.score);
        this.render(this.result, '');
        this.render(this.info, '');
        this.resetForm();
    },
    render(target, content, attributes) {
        for (const key in attributes) {
            target.setAttribute(key, attributes[key]);
        }
        target.innerHTML = content;
    },
    show(element) {
        element.style.display = 'block';
    },
    hide(element) {
        element.style.display = 'none';
    },
    resetForm() {
        this.response.answer.value = '';
        this.response.answer.focus();
    },
    tearDown() {
        this.hide(this.question);
        this.hide(this.response);
        this.show(this.start);
    }
};

const game = {
    start(quiz) {
        console.log("start() invoked");
        this.questions = [...quiz];
        this.score = 0;
        this.secondsRemaining = 20;
        this.timer = setInterval(this.countdown, 1000);
        view.setup();
        this.ask();
    },
    ask(name) {
        console.log("ask() invoked");
        if (this.questions.length > 0) {
            shuffle(this.questions);
            this.question = this.questions.pop();
            const question = ` What is ${this.question.name}'s real name?`;
            view.render(view.question, question);
        } else {
            this.gameOver();
        }
    },
    check(event) {
        console.log("check(event) invoked");
        event.preventDefault();
        const response = view.response.answer.value;
        const answer = this.question.realName;
        if (response === answer) {
            view.render(view.result, 'Correct!', {'class': 'correct'});
            this.score++;
            view.render(view.score, this.score);
        } else {
            view.render(view.result, `Wrong! The correct answer was ${answer}`, {'class': 'wrong'});
        }
        view.resetForm();
        this.ask();
    },
    countdown() {
        game.secondsRemaining--;
        view.render(view.timer, game.secondsRemaining);
        if (game.secondsRemaining < 0) {
            game.gameOver();
        }
    },
    gameOver() {
        console.log("gameOver() invoked");
        view.render(view.info, `Game over, you scored ${this.score} point${this.score !== 1 ? 's' : ''}`)
        view.tearDown();
        clearInterval(this.timer);
    }
}

view.start.addEventListener('click', () => game.start(quiz), false);
view.response.addEventListener('submit', (event) => game.check(event), false);
view.hide(view.response);


