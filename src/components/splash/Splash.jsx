import Spline from '@splinetool/react-spline';
import styles from './splash.module.scss';
import { useNavigate } from 'react-router-dom';
import { React } from 'react';

export const Splash = () => {
  const navigate = useNavigate();

  function onSplineMouseHover(e) {
    if (e.target.name === 'SignIn') {
      console.log('I have been clicked!');
      setTimeout(() => {
        navigate('/signin');
      }, 3000); // Delay of 1 second (1000 milliseconds)
    }

    if (e.target.name === 'SignUp') {
      console.log('I have been clicked!');
      setTimeout(() => {
        navigate('/signup');
      }, 3000); // Delay of 1 second (1000 milliseconds)
    }
  }

  function onSplineMouseDown(e) {
    if (e.target.name === 'SignIn') {
      console.log('I have been clicked!');
      setTimeout(() => {
        navigate('/signin');
      }, 3000); // Delay of 1 second (1000 milliseconds)
    }

    if (e.target.name === 'SignUp') {
      console.log('I have been clicked!');
      setTimeout(() => {
        navigate('/signup');
      }, 3000); // Delay of 1 second (1000 milliseconds)
    }
  }

  return (
    <main className={styles.splineContainer}>
      <Spline
        className={styles.splineCanvas}
        scene="https://prod.spline.design/SI2VYUoLRroxOxSr/scene.splinecode"
        onSplineMouseHover={onSplineMouseHover}
        onSplineMouseDown={onSplineMouseDown}
      />
    </main>
  );
};
