import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getAllProjects()
  }

  getAllProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeOptionId} = this.state
    console.log(activeOptionId)
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getAllProjects)
  }

  onClickSearch = () => {
    this.getAllProjects()
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" height={50} width={50} color="#3b1cd6" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container" testid="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-text">Oops! Something Went Wrong</h1>
      <p className="failure-note">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-btn"
        type="button"
        onClick={this.onClickSearch}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="project-container">
        {projectsList.map(each => (
          <li key={each.id} className="project-item">
            <img src={each.imageUrl} alt={each.name} className="image" />
            <h1 className="head">{each.name}</h1>
          </li>
        ))}
      </ul>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeOptionId} = this.state

    return (
      <div className="app-container">
        <nav className="nav-bar">
          <div className="nav-content">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </div>
        </nav>
        <div className="projects">
          <select
            className="select-container"
            value={activeOptionId}
            onChange={this.onChangeSelectOption}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id} className="select-option">
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderAllViews()}
        </div>
      </div>
    )
  }
}

export default Projects
