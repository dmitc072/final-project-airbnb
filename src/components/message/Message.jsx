import { useState, React } from 'react';
import styles from './messages.module.scss';
import { Button, Typography, useMediaQuery } from '@mui/material';

export const Message = () => {
  const mobileView = useMediaQuery('(max-width: 590px)');
  const [message, setMessage] = useState('');

  return (
    <>
      <div className={styles.container}>
        <div className={styles.messageTitle}>Message Title</div>
        {!mobileView && <div className={styles.line}></div>}
        <div className={styles.message}>
          <div className={styles.messageContainer}>
            <Typography variant="h5">Message</Typography>
            <div className={styles.messageBox}>
              <textarea
                className={styles.displayMessage}
                rows={4}
                value={message} // Use value prop
                onChange={(e) => setMessage(e.target.value)} // Update state on change
              />
              <Button
                onClick={() => {
                  /* Handle submit */
                }}
              >
                Submit
              </Button>
            </div>
          </div>
          <br />
          {/* Mapping can go here */}
          <div className={styles.returnMessageRenter}>
            <div className={styles.renter}>dd</div>
          </div>
          <div className={styles.returnMessageHost}>
            <div className={styles.host}>dd</div>
          </div>
        </div>
      </div>
    </>
  );
};
