import React from 'react';
import styles from '../Invoice.module.scss'

const Logo = ({ logoFile, fileHandler, fileName }) => {
    return (
        <div className={styles.logoWrapper}>
            <img width={100} height={100} src={logoFile} alt={""} className={styles.logo} />
            <label htmlFor="file-upload" className={styles.logoUploadLabel}>Upload Logo</label>
            <input type="file" onChange={fileHandler} id="file-upload" className={styles.logoUpload} />
            { fileName && <span className={styles.logoFileName}>{fileName}</span>}
        </div>
    )
}

export default Logo