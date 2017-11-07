
import React from 'react';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Checkbox, Icon, Message } from 'semantic-ui-react'
import LessonScreenBaseClass from './LessonScreenBaseClass'
import './LessonMultipleChoice.css'

class LessonMultipleChoice extends LessonScreenBaseClass {
  constructor(props) {
    super(props)
    this.state = {
      questions: JSON.parse(JSON.stringify(this.props.content.questions)),
      score: 'notyet'
    }

  }

  handleChange = (e, { name, value }) => {
    var qindex = name-0 // convert to number
    let questions = JSON.parse(JSON.stringify(this.state.questions))
    questions[qindex].value = value
    this.setState({ questions })
  }

  checkAnswers = (e) => {
    let { questions } = this.state
    let anyWrong = questions.some(question => question.value !== question.a)
    if (!anyWrong) {
      this.props.onScreenComplete() // Tell LessonWizard ok to activate Next button
    }
    this.setState({ score: anyWrong ? 'fail' : 'pass' })
  }

  tryAgain = (e) => {
    let questions = JSON.parse(JSON.stringify(this.state.questions))
    questions.forEach(question => { question.value = null })
    this.setState({ score: 'notyet', questions })
  }

  scrollButtonIntoView = () => {
    setTimeout(() =>{
      let LessonMultipleChoiceButtonRow = document.querySelector('.LessonMultipleChoiceButtonRow')
      if (LessonMultipleChoiceButtonRow) {
        LessonMultipleChoiceButtonRow.scrollIntoView()
      }
    }, 20)
  }

  render() {
    let { questions, score } = this.state
    let notAllAnswered = questions.some(question => typeof question.value !== 'string')
    let scoreStyle = score !== 'notyet' ? { visibility: 'visible' } : { visibility: 'hidden' }
    let disableRadios = (score !== 'notyet')
    let qarray = []
    let count = 0
    questions.map((question, qindex) => {
      let correct = question.value === question.a
      let icon = correct ? 'check circle' : 'remove circle'
      qarray.push( <div key={(count++).toString()} className="LessonMultipleChoiceQuestionText">
        <div className="LessonMultipleChoiceNumber">{qindex+1}</div>
        <div className="LessonMultipleChoiceQuestion">{question.q}</div>
        <div className="LessonMultipleChoiceScore"> <Icon style={scoreStyle} name={icon} size='large' /> </div>
      </div> )
      let crows = []
      question.choices.map((choice, cindex) => {
        let letter = String.fromCharCode(97+cindex)
        crows.push( <label key={(count++).toString()} className="LessonMultipleChoiceChoice">
          <Checkbox radio name={qindex.toString()} value={letter} checked={question.value === letter} disabled={disableRadios} fitted={false} onChange={this.handleChange} />
          <div className="LessonMultipleChoiceChoiceLabel">{letter+'.'}</div>
          <div className="LessonMultipleChoiceQuestion">{choice}</div>
        </label> )
        return null
      })
      qarray.push( <div key={(count++).toString()} className="LessonMultipleChoiceQuestionChoices">
        {crows}
      </div> )
      return null
    })
    let buttonRow
    if (!notAllAnswered && score === 'notyet') {
      buttonRow = <Button className="CheckAnswers" onClick={this.checkAnswers} >Check my answers</Button>
      this.scrollButtonIntoView()
    } else if (score === 'fail') {
      buttonRow = <Button className="TryAgain" onClick={this.tryAgain} >Try again</Button>
      this.scrollButtonIntoView()
    } else if (score === 'pass') {
      buttonRow = ( <Message className="Congrats">
          <Message.Header>Congratulations!</Message.Header>
          <p>Please press one of the navigation buttons below to proceed.</p>
        </Message> )
      this.scrollButtonIntoView()
    }
    return (
      <div className="LessonMultipleChoice" >
        <div className="LessonMultipleChoiceQuestions" >
          {qarray}
        </div>
        <div className="LessonMultipleChoiceButtonRow">
          {buttonRow}
        </div>
      </div>
    );
  }
}

LessonMultipleChoice.propTypes = {
  store: PropTypes.object.isRequired,
  content: PropTypes.object.isRequired,
  onScreenComplete: PropTypes.func.isRequired
}

export default withRouter(LessonMultipleChoice);
