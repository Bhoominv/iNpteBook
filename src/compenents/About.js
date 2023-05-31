import React, { useContext, useEffect } from 'react';
import NoteContext from '../context/notes/noteContext';

const About = () => {
  const a = useContext(NoteContext);

  // useEffect(() => {
  //     a.update();
  //     // eslint-disable-next-line
  // }, []);

  return (
    <div>
      <p>Hello this is About {a.state1.name}, and this website is in {a.state1.stage} stage</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eaque quam minus ut totam ratione. Debitis autem distinctio aut obcaecati eaque, omnis, fugit ea aperiam voluptatum, impedit numquam ab. Odit?</p>
    </div>
  )
}

export default About
