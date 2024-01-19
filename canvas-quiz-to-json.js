// open a canvas quiz page and run this code in the browser console.
(function () {
    const questions = document.getElementsByClassName("question"),
        output = [];
    for (const question of questions) {
        if (!question.classList.contains("multiple_choice_question")) {
            console.warn("Encountered non-multiple choice question. Skipping!");
            continue;
        }
        const incorrect = question.classList.contains("incorrect");
        const id = question.id.replace("question_", ""),
            gotCorrect = question.classList.contains("correct"),
            questionText = question
                .querySelector(".text")
                .querySelector(":scope > .question_text")
                .textContent.trim(),
            questionImages = Array.from(
                question
                    .querySelector(".text")
                    .querySelector(":scope > .question_text")
                    .querySelectorAll("img")
            ).map((img) => img.src),
            answers = question
                .querySelector(".text")
                .querySelector(":scope > .answers")
                .querySelector(".answers_wrapper")
                .querySelectorAll(".answer"),
            answerList = [];
        for (const answer of answers) {
            // canvas bug that sometimes results in empty extra answers
            const selectAnswer = answer.querySelector(".select_answer");
            if (selectAnswer == null) continue;

            const label = selectAnswer.querySelector("label");

            const text =
                    label.querySelector(".answer_text").textContent ||
                    label.querySelector(".answer_html").textContent,
                correct = answer.classList.contains("correct_answer");
            answerList.push({
                text: text,
                correct: correct,
                selected: selectAnswer.querySelector("input").checked,
            });
        }
        if (answerList.length === 0) {
            console.warn("Encountered question with no answers. Skipping!");
            console.log(question, [...answers]);
            continue;
        }
        const noCorrectAnswer = answerList.every((answer) => !answer.correct);
        if (noCorrectAnswer) {
            if (incorrect) {
                console.warn(
                    "Encountered question with no correct answer and the question was marked incorrect. Skipping!"
                );
                continue;
            } else {
                // correct is selected
                answerList.forEach((answer) => {
                    answer.correct = answer.selected;
                });
            }
        }
        answerList.forEach((answer) => {
            delete answer.selected;
        });
        output.push({
            description: {
                images: questionImages,
                text: questionText,
            },
            answers: answerList,
            gotCorrect: gotCorrect,
            id: id,
        });
    }
    console.log(output);
    const outputString = JSON.stringify(output);
    prompt('Press "Ctrl+C, Enter" to Copy to Clipboard:', outputString);
})();
