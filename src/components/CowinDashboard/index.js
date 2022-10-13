// Write your code here
import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {VaccinationCoverage} from '../VaccinationCoverage'
import {VaccinationByGender} from '../VaccinationByGender'
import {VaccinationByAge} from '../VaccinationByAge'

const status = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProcess: 'INPROCESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationDetails: '',
    apiStatus: status.initial,
  }

  componentDidMount() {
    this.getVaccinationDetails()
  }

  updatedLastDays = data => {
    const updatedData = data.map(each => ({
      vaccineDate: each.vaccine_date,
      dose1: each.dose_1,
      dose2: each.dose_2,
    }))
    return updatedData
  }

  getVaccinationDetails = async () => {
    this.setState({
      apiStatus: status.inProgress,
    })

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    // const response = await fetch(url)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        last7DaysVaccination: this.updatedLastDays(
          data.last_7_days_vaccination,
        ),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      console.log(updatedData)
      this.setState({
        vaccinationDetails: updatedData,
        apiStatus: status.success,
      })
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  loading = () => (
    <div testid="loader">
      {/* <div> */}
      <Loader type="ThreeDots" color="#blue" height={80} width={80} />
    </div>
  )

  successView = () => {
    const {vaccinationDetails} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = vaccinationDetails
    return (
      <>
        <VaccinationCoverage details={last7DaysVaccination} />
        <VaccinationByGender details={vaccinationByGender} />
        <VaccinationByAge details={vaccinationByAge} />
      </>
    )
  }

  failureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </>
  )

  renderSwitch = param => {
    switch (param) {
      case status.success:
        return this.successView()

      case status.failure:
        return this.failureView()

      case status.inProcess:
        return this.loading()
      // return console.log('p')

      default:
        return null
    }
  }

  render() {
    const {vaccinationDetails, apiStatus} = this.state
    console.log(vaccinationDetails, apiStatus)

    return (
      <div>
        <img
          className="logo"
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1>co-WIN</h1>
        <h1>coWIN Vaccination in india</h1>

        {this.renderSwitch(apiStatus)}
      </div>
    )
  }
}
export default CowinDashboard
