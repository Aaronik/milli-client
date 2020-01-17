import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route as RRRoute, RouteProps, RouteComponentProps, Link, Switch } from 'react-router-dom'
import { Provider, connect } from 'react-redux'
import { StylesManager } from 'survey-react'
import * as icons from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Image from 'react-bootstrap/Image'

import PageNotFound from 'pages/NotFound'
import NotSignedInPage from 'pages/NotSignedIn'
import DoctorDashboard from 'pages/DoctorDashboard'
import DoctorTimelinePage from 'pages/DoctorTimeline'
import AdminDashboard from 'pages/AdminDashboard'
import ProfileDropdown from 'applets/ProfileDropdown'
import SigninPage from 'pages/SignIn'
import SignupPage from 'pages/SignUp'
import DoctorProfilePage from 'pages/DoctorProfile'
import DoctorSettingsPage from 'pages/DoctorSettings'
import PatientDashboard from 'pages/PatientDashboard'
import PatientIntakePage from 'pages/PatientIntake'
import DoctorActivityPage from 'pages/DoctorActivity'
import DoctorMessagesPage from 'pages/DoctorMessages'
import DoctorSchedulePage from 'pages/DoctorSchedule'
import DoctorOverviewPage from 'pages/DoctorOverview'

import Alert from 'applets/Alert'
import Fade from 'common/components/Fade'
import AppGutterNav, { LinkEntryProps, GutterAwareFluidContainer, GutterNavToggleButton } from 'applets/AppGutterNav'
import { loadHostMap, signInWithPersistentStateIfExists } from 'concerns/Auth.actions'
import store, { TStoreState } from 'common/store'
import currentUser from 'common/util/currentUser'
import { TUserType as TStoreUserType } from 'concerns/User.d'
import strings from './App.strings'
import 'App.sass'

// Things to do once when the page loads
StylesManager.applyTheme('bootstrap')

const AppNavBar: React.FC = ({ children }) => <Navbar sticky='top' className='justify-content-between app-navbar'>{children}</Navbar>
const MilliBrandLink = () => <Navbar.Brand><Link to='/'><Image width={70} height={25} src='/milli-logo.png'/></Link></Navbar.Brand>
const NavLink = ({ to, text }: { to: string, text: string }) => <Nav.Link as={Link} to={to}>{text}</Nav.Link>

// This is so every Route gets a fade in when mounted.
// Signin/out has background, which also fades and is super hard on the eyes.
// So an option is here to not fade.
// Note that if you have to take this option, you can still use <Fade> inside
// the actual component you're working on.
const Route: React.FC<RouteProps & { noFade?: boolean }> = ({ noFade, component, ...props }) => {
  const Component = component as React.ComponentType<RouteProps>

  const FadedComponent = (props: RouteComponentProps) => (
    <Fade><Component {...props}/></Fade>
  )

  return <RRRoute {...props} component={noFade ? Component : FadedComponent} />
}

const SignedOutBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <NavLink to='/signin' text={strings('signIn')} />
          <NavLink to='/signup' text={strings('signUp')} />
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={NotSignedInPage} />
        <Route path='/signin' component={SigninPage} noFade/>
        <Route path='/signup' component={SignupPage} noFade/>
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const AdminBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
          <NavLink to='/doctors' text={strings('doctors')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={AdminDashboard} />
        <Route path='/doctors' component={() => <h1>Admin/Doctors</h1>} />
        <Route path='/profile' component={() => <h1>Admin Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

const DoctorWithPatientBase: React.FunctionComponent<{}> = () => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faSquare, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
    { separator: true },
    { to: '/overview', text: strings('overview'), icon: icons.faTachometerAlt, fade: true },
    { to: '/messages', text: strings('messages'), icon: icons.faCommentDots, fade: true },
    { to: '/timeline', text: strings('healthTimeline'), icon: icons.faCheckCircle, fade: true },
    { to: '/schedule', text: strings('schedule'), icon: icons.faCalendar, fade: true },
    { to: '/activity', text: strings('activity'), icon: icons.faClock, fade: true },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <AppGutterNav entries={gutterRoutes}/>

      <GutterAwareFluidContainer>
        <Switch>
          <Route path='/' exact component={DoctorDashboard} />
          <Route path='/settings' component={DoctorSettingsPage} />
          <Route path='/profile' component={DoctorProfilePage} />

          <Route path='/timeline' component={DoctorTimelinePage} />
          <Route path='/activity' component={DoctorActivityPage} />
          <Route path='/messages' component={DoctorMessagesPage} />
          <Route path='/overview' component={DoctorOverviewPage} />
          <Route path='/schedule' component={DoctorSchedulePage} />
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const DoctorNoPatientBase: React.FunctionComponent<{}> = () => {
  const gutterRoutes: LinkEntryProps[] = [
    { to: '/', text: strings('dashboard'), icon: icons.faSquare, exact: true },
    { to: '/settings', text: strings('settings'), icon: icons.faCog },
  ]

  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <GutterNavToggleButton className='align-self-center pr-3 d-lg-none d-md-block'/>
          <MilliBrandLink/>
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <AppGutterNav entries={gutterRoutes}/>

      <GutterAwareFluidContainer>
        <Switch>
          <Route path='/' exact component={DoctorDashboard} />
          <Route path='/settings' component={DoctorSettingsPage} />
          <Route path='/profile' component={DoctorProfilePage} />
          <Route component={PageNotFound} />
        </Switch>
      </GutterAwareFluidContainer>
    </React.Fragment>
  )
}

const PatientBase: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <AppNavBar>
        <Nav>
          <MilliBrandLink/>
          <NavLink to='/intake' text={strings('intakeSurvey')} />
        </Nav>
        <Nav>
          <ProfileDropdown/>
        </Nav>
      </AppNavBar>

      <Alert />

      <Switch>
        <Route path='/' exact component={PatientDashboard} />
        <Route path='/intake' exact component={PatientIntakePage} />
        <Route path='/profile' component={() => <h1>Patient Profile</h1>} />
        <Route component={PageNotFound} />
      </Switch>
    </React.Fragment>
  )
}

type TUserType = TStoreUserType | 'SIGNED_OUT'

type TBaseProps = {
  userType: TUserType
  activePatientId: string | false
}

const Base: React.FunctionComponent<TBaseProps> = ({ userType, activePatientId }) => {

  let Component = <SignedOutBase />

  switch (userType) {
    case 'ADMIN':
      Component = <AdminBase />
      break
    case 'DOCTOR':
      Component = !!activePatientId ? <DoctorWithPatientBase /> : <DoctorNoPatientBase />
      break
    case 'PATIENT':
      Component = <PatientBase />
      break
  }

  return (
    <Router>
      { Component }
    </Router>
  )
}

const BaseWithProps = connect((storeState: TStoreState) => {
  const userType: TUserType = currentUser() ? currentUser().type : 'SIGNED_OUT'

  return {
    userType: userType,
    activePatientId: storeState.user.activePatientId,
  }
})(Base)

const App: React.FunctionComponent = () => {

  // Stuff to do on initial mount
  useEffect(() => {
    loadHostMap().then(() => signInWithPersistentStateIfExists())
  }, [])

  return (
    <Provider store={store}>
      <BaseWithProps/>
    </Provider>
  )
}

export default App
