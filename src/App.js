import React from 'react';
import './App.css';

import { fetchJobDetails } from './service/service';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobData: [],
      error: false,
      isLoading: true,
      errorMessage: '',
      allJobData: [],
      limit: 10,
      searchText: '',
      isSearching: false,
      // This state is used when user earse the search bar then user get its data which is display before.
      copyJobData: []
    }
  }

  componentDidMount() {
    // Making api request to jobs in oder to get data of jobs
    const data = {
      "companySkills": true,
      "dismissedListingHashes": [],
      "fetchJobDesc": true,
      "jobTitle": "Business Analyst",
      "locations": [],
      "numJobs": 20,
      "previousListingHashes": []
    }

    fetchJobDetails(data, this.makeListingOfJob, this.apiErrorHandle);
  }

  apiErrorHandle = (error) => {
    this.setState({
      isLoading: false,
      error: true,
      errorMessage: error.message
    });
  }

  makeListingOfJob = (result) => {
    const { limit } = this.state;

    /*** To make filter data by 7d ago  */
    /** API gives already filtered data which is within 7d ago */
    // const todayDate = new Date();
    // const pastWeek = Date.parse(new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 7));
    // const newDatedFilterData = [];
    // for (let i = 0; i < result.length; i++) {
    //   if (pastWeek < Date.parse(result[i].OBJpostingDate)) {
    //     newDatedFilterData.push(result[i]);
    //   }
    // }

    this.setState({
      isLoading: false,
      jobData: result.slice(0, limit),
      copyJobData: result.slice(0, limit),
      allJobData: result
    });
  }

  loadMoreJobs = () => {
    /** User click on load more button then load another 10 job */
    const { allJobData, limit } = this.state;
    const newLimit = limit + 10;
    this.setState({
      jobData: allJobData.slice(0, newLimit),
      copyJobData: allJobData.slice(0, newLimit),
      limit: newLimit
    })
  }

  handleSearch = (e) => {
    /** When user start searching the jobs */
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      isSearching: true,
    });
    this.filterItem(value);
  }

  filterItem = (value) => {
    const { allJobData, copyJobData } = this.state;
    if (value === '') {
      /** If user empty the search bar then previous loaded data is display */
      this.setState({ jobData: copyJobData, isSearching: false });
    }
    else {
      /** Search is done via company name */
      const filteredData = allJobData.filter(job => {
        return job['companyName'].toLowerCase().includes(value.toLowerCase());
      })
      this.setState({
        jobData: filteredData
      })
    }
  }

  render() {
    const { isLoading, error, errorMessage, jobData, searchText, isSearching, allJobData } = this.state;
    return (
      <>
        {(!isLoading && error) ?
          /** If error is occured in api data */
          <div className="error-message-conatiner">
            {errorMessage}
          </div>
          :
          /** If data appears */
          <div className="container">
            <h1 style={{ textAlign: 'center' }}>Zippia jobs</h1>
            {
              /** Display loading mask until data is not retrive from api */
              isLoading ?
                <div className="text-center" style={{ margin: '50px auto' }}>
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                :
                (
                  <>
                    <input type="text" value={searchText} name="searchText" className="form-control" placeholder={searchText === '' ? 'Search by company name' : ''} onChange={(e) => this.handleSearch(e)} />
                    <div className="row mt-2">
                      {
                        jobData.map(job => (
                          <div className="col-md-3 col-sm-2 col-12 jobs-cotainer">
                            <div className="job-name">{job.jobTitle}</div>
                            <div className="company-name mt-2">{job.companyName}</div>
                            <div className="job-description mt-2">{job.shortDesc}</div>
                          </div>
                        ))
                      }
                    </div>
                    {
                      /** If loading is false, error is false, user is not searching, if data is not fully loaded then only dispaly load more button */
                      (!isLoading && !error && !isSearching && (jobData.length !== allJobData.length)) &&
                      <div className="text-center mt-2">
                        <button className="btn btn-primary" onClick={() => this.loadMoreJobs()}>Load more</button>
                      </div>}
                  </>)
            }
          </div>
        }
      </>
    );
  }
}

export default App;
