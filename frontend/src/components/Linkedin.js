import React from 'react'
import gif from './../images/test.gif';

function Linkedin() {
  return (
    <div class="container">

            <p class="slogan">Bring your career to new <span class="green">heights</span> </p>
            <p class ="frontCatchPhrase">The platform <br></br> Where <span class="green">interests</span> <br></br> become <span class="green">friendships </span></p>
            <p class ="catch">Whatever your interest, from hiking and reading to networking<br></br> and skill sharing, there are thousands of people who share it on<br></br> Meetup. Events are happening every day—log in to join the fun.</p>
            <img class="gif" src={gif} alt='gif'></img>
    </div>
  )
}

export default Linkedin
