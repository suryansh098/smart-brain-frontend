import React, {Component} from 'react';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SIGNIN',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }});
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height  = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://secure-crag-18714.herokuapp.com/imageUrl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 
        input: this.state.input,
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response) {
        fetch('https://secure-crag-18714.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
            id: this.state.user.id,
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response));
      }
    )
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'HOME') {
      this.setState({isSignedIn: true});
    }
    else {
      this.setState(initialState);
    }
    this.setState({route: route});
  }

render() {
  return (
    <div className="App">
      <Particles className='App-bg'
        params={particlesOptions}
      />
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
      <Logo />
      { this.state.route === 'HOME'
          ? <div>
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onPictureSubmit={this.onPictureSubmit}
              />
              <FaceRecognition box={ this.state.box } imageUrl={ this.state.imageUrl }/>
            </div>
          :
          ( this.state.route === 'SIGNIN'
        ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        :  <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> )
      }
    </div>
  );
}
}

export default App;
