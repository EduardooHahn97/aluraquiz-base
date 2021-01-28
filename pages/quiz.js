/* eslint-disable react/prop-types */
import React from 'react';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativesForm';
import Button from '../src/components/Button';
import { func } from 'prop-types';

function LoadingWidget(){
    return(
        <Widget>
            <Widget.Header>
                Carregando...
            </Widget.Header>

            <Widget.Content>
                [Desafio sendo carregado]
            </Widget.Content>
        </Widget>
    )
}

function QuestionWidget( {question, totalQuestion, questionIndex, onSubmit,}){
    const questionId = `question_${questionIndex}`;
    return(
        <Widget>
            <Widget.Header>
                {/*<BackLinkArrow href="/">*/ }
                <h3>
                    Pergunta {`${questionIndex+1}`} de {`${totalQuestion}`}
                </h3>
            </Widget.Header>
            <img
                alt="Descrição"
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                }}
                src={question.image}
            />

            <Widget.Content>
                <h2>
                    {question.title}
                </h2>
                <p>
                    {question.description}
                </p>
                <form 
                    onSubmit={(infoEvento) => {
                        infoEvento.preventDefault();
                        onSubmit();
                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) =>{
                        const alternativeId = `alternative_${alternativeIndex}`;
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Widget.Topic 
                                as="label"
                                htmlFor={alternativeId}
                            >
                                <input id={alternativeId} type="radio" name={questionId} /*style={{display:"none"}}*/ />
                                {alternative}
                            </Widget.Topic>
                            
                        );
                    })}

                    {/*<pre>
                        {JSON.stringify(question, null, 4)}
                    </pre>*/}

                    <Button type='submit'>
                        Confirmar
                    </Button>
                </form>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
}

export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const totalQuestion = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];


    React.useEffect(() => {
        setTimeout(()=>{
            setScreenState(screenStates.QUIZ);
        }, 1 * 1000);
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = questionIndex + 1;
        if (nextQuestion < totalQuestion){
            setCurrentQuestion(questionIndex + 1);
        }else {
            setScreenState(screenStates.RESULT);
        }        
    }
    
    
    return(
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo/>

                { screenState === screenStates.QUIZ && (
                    <QuestionWidget 
                        question={question}
                        totalQuestion={totalQuestion}
                        questionIndex={questionIndex}
                        onSubmit={handleSubmitQuiz}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget/>}

                {screenState === screenStates.RESULT && <div>Você acertou X questões, parebéns </div>}

            </QuizContainer>
        </QuizBackground>
    )
}