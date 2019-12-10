import React from 'react'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Select from 'react-select'
import { TUser } from 'concerns/user/User.d'
import { TStoreState } from 'common/store'
import strings from './PatientPicker.strings'
import { patients } from 'common/util/users'
import { setActiveUser } from 'concerns/user/User.actions'
import Avatar from 'common/components/Avatar'

// This component lives in the top left on the top of the left gutter nav.
// It is what allows doctors to chose the active patient

type TProps = {
  patients: TUser[]
  className?: string
  activePatientId: string | false
}

type TOption = { value: string, label: string }

const mapPatientsToOptions = (patients: TUser[]): TOption[] => patients.map(mapPatientToOption)

const mapPatientToOption = (patient: TUser): TOption => (
  { value: patient.id, label: patient.name }
)

const formatOptionLabel = (patients: TUser[]) => ({ value, label }: TOption) => {
  const patient = patients.find(p => p.id === value)
  if (!patient) return <span>{strings('patientNotFound')}</span>

  return (
    <div className='d-flex flex-row align-items-center'>
      <Avatar user={patient} size={30}/>
      <span className='pl-2'>{patient.name}</span>
    </div>
  )
}

const PatientPicker: React.FC<TProps> = ({ patients, className, activePatientId }) => {
  const activePatient = patients.find(p => p.id === activePatientId)

  // For the dropdown, let's sort the patients alphabetically for ease of finding.
  // The Avatar list will be sorted by the server, hopefully by frequency of use.
  const alphabeticallySortedPatientOptions = mapPatientsToOptions(patients).sort((a, b) => a.label[0] < b.label[0] ? -1 : 1)

  return (
    <Container>
      <Select
        isClearable
        className={className}
        onChange={option => {
          if (!option) return setActiveUser(false)
          // @ts-ignore I don't know how to properly type this, sorry.
          setActiveUser(option.value)
        }}
        value={activePatient && mapPatientToOption(activePatient)}
        placeholder={strings('selectPatient')}
        formatOptionLabel={formatOptionLabel(patients)}
        options={alphabeticallySortedPatientOptions} />
      <Row className='ml-0 mt-3'>
        { patients.map(p => <Avatar user={p} className='ml-2' onClick={() => setActiveUser(p.id)}/>)}
      </Row>
    </Container>
  )
}

export default connect((storeState: TStoreState) => ({ patients: patients(), activePatientId: storeState.user.activePatientId }))(PatientPicker)
