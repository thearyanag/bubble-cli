import inquirer from "inquirer";

const askCreate = async (stats) => {
    const questions = [
        {
            type: "input",
            name: "name",
            message: "What is your name?",
        },
        {
            type: "input",
            name: "email",
            message: "What is your email?",
        },
    ];

    const answers = await inquirer.prompt(questions);
    return answers;
}

export default askCreate;