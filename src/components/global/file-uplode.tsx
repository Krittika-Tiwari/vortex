import React from 'react'

type Props = {
    apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo'
    onChange: (url?: string) => void
    value?: string
  }
  

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  return (
    <div>file-uplode</div>
  )
}

export default FileUpload