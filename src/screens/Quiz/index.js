/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React from 'react';
//import db from '../../../db.json';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';

import { func } from 'prop-types';


function ResultWidget({results}){
    return(
        <Widget>
            <Widget.Header>
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                <p>Você acertou {' '}
                    {/*results.reduce((somatoriaAtual, resultAtual) => {
                        const isAcerto = resultAtual === true;
                        if (isAcerto){
                            return somatoriaAtual +1;
                        }
                        return somatoriaAtual;
                    }, 0)*/} 
                {results.filter((x) => x).length}
                {' '} questões</p>
                <ul>
                    {results.map((result, index) => (
                        <li key={`result_${result}`}>
                            {index+1} {' '} - Resultado:
                            {result === true ? ' Acertou' : ' Errou'}
                        </li>
                    ))}
                    
                </ul>
            </Widget.Content>
        </Widget>
    )
}

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

function QuestionWidget( {question, totalQuestion, questionIndex, onSubmit, addResult,}){
    const [selectedAlternative, setSelectAlternative] = React.useState(undefined);
    const questionId = `question_${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const [isQuestionSubmit, setIsQuestionSubmit] = React.useState(false);
    const hasAlternativeSelected = selectedAlternative !== undefined;

    return(
        <Widget>
            <Widget.Header>
                <BackLinkArrow href="/"/>
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
                <AlternativesForm 
                    onSubmit={(infoEvento) => {
                        infoEvento.preventDefault();
                        setIsQuestionSubmit(true);
                        setTimeout(()=> {
                            addResult(isCorrect);
                            onSubmit();
                            setIsQuestionSubmit(false);
                            setSelectAlternative(undefined);
                        }, 2 * 1000);
                        
                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) =>{
                        const alternativeId = `alternative_${alternativeIndex}`;
                        const alternativeStatus = isCorrect ? 'SUCESS' : 'ERROR';
                        const isSelected = selectedAlternative === alternativeIndex;
                        return (
                            // eslint-disable-next-line react/jsx-key
                            <Widget.Topic 
                                as="label"
                                key={alternativeId}
                                htmlFor={alternativeId}
                                data-selected={isSelected}
                                data-status={isQuestionSubmit && alternativeStatus}
                            >
                                <input 
                                    id={alternativeId} 
                                    type="radio" 
                                    name={questionId}
                                    onChange={() => setSelectAlternative(alternativeIndex)}
                                     style={{display:"none"}} />
                                {alternative}
                            </Widget.Topic>
                            
                        );
                    })}

                    {/*<pre>
                        {JSON.stringify(question, null, 4)}
                    </pre>*/}

                    <Button type='submit' disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>
                    {/*<p>{selectedAlternative}</p>*/}
                    {isQuestionSubmit && isCorrect && <p>Voce Acertou!</p>}
                    {isQuestionSubmit && !isCorrect && <p>Voce Errou!</p>}
                </AlternativesForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
}

export default function QuizPage( externalQuestions, externalBg) {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING);
    const totalQuestion = externalQuestions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = externalQuestions[questionIndex];
    const [results, setResults] = React.useState([]);

    function addResult(result){
        //results.push(result);
        setResults([
            ...results,
            result,
        ]);
    }


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
        <QuizBackground backgroundImage={externalBg}>
            <QuizContainer>
                <QuizLogo/>

                { screenState === screenStates.QUIZ && (
                    <QuestionWidget 
                        question={question}
                        totalQuestion={totalQuestion}
                        questionIndex={questionIndex}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget/>}

                {screenState === screenStates.RESULT && <ResultWidget results={results}/>}

            </QuizContainer>
        </QuizBackground>
    )
}