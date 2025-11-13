const search = document.getElementById('search');
const main = document.getElementById('main');
const form = document.getElementById('form');
url = '/detail'

const listItems = []

getData()

search.addEventListener('input', (e) => filterData(e.target.value));

async function getData() {
    const res = await fetch(url)
    const nuasa = await res.json()

    // Clear result
    main.innerHTML = ''

    nuasa.forEach((user) => {
        const div = document.createElement('div')
        listItems.push(div)
        div.innerHTML = `<a style="text-decoration:none;" href="/edit/${user._id}">
        <div class="movie">
        <img src="${user.image}"style="height:100px; width:90px;">
        <div class="movie-info">
      <h3>${user.Aname.Name} ${user.Aname.Mname} ${user.Aname.Surname}</h3>
        </div></div> </a>
        `
        main.appendChild(div)

    })
}

function filterData(searchTerm) {
  listItems.forEach(item => {
      if (item.innerText.toLowerCase().includes(searchTerm.toLowerCase())) {
          item.classList.remove('hide')
      } else {
          item.classList.add('hide')
      }
  })
}
getmovieee();
async function getmovieee() {
  let objects = document.getElementById("objects");
  const res = await fetch(url)
  const  nuasa = await res.json()
  let allObject = nuasa.filter((val) => {
      if (typeof val == 'object') {
          return true;
      } else { return false; }
  });
  let objectsLen = allObject.length;
  objects.innerHTML += "" + objectsLen
}


function movieselected(_id) {
  sessionStorage.setItem('movieId', _id);
  window.location = 'samplepreview.html';
  return false;

}


async function getmovie() {
  let movieId = sessionStorage.getItem('movieId');
  console.log(movieId)
  const res = await fetch(url)
  const data = await res.json()
  let id = data.filter(ids => ids._id === movieId);
  console.log(id)

  const html = id.map(user => {
      const li = document.createElement('li')
      li.innerHTML = `
      <div class="profile-top" style="margin-top: 0rem;justify-content: center;background-image: url('op.JPG');background-repeat: no-repeat;background-size: cover;padding: 20px 0px;" >
					<div style="margin-bottom: 1rem;justify-content: center;align-items: center;text-align: center;">
						<div style="margin-top: .5rem;">
							<img class="flip" style="height: 100px;
							width: 100px;
							border-radius: 50px;
							margin-top: -30px;
							justify-content: center;
							position: relative;
							margin: auto;
							column-gap: 0rem;
							text-align: center;
							justify-content: center;
							margin-bottom: 0%;
							" src="btnn.jpg" alt="">         
						</div>
						<h2 style="font-size: 21px;font-weight: bolder;color: white;" >NATIONAL ASSOCOATION OF</h2>
                        <h2 style="font-size: 23px;font-weight: bolder;color: white;">MICROBIOLOGY STUDENT</h2>
						<p style="font-size: 21px;font-weight: bolder;color: black;">IMO STATE UNIVERSITY</p>
					</div>

                    
      <div style="justify-content: center; justify-self: center;margin-bottom: 10px;">
						<div class="profile-info" style="justify-self: center;border: 1px solid #cec3c3;padding: 15px 20px;background-color: transparent;height: 22rem;;
						width: 19rem;background: rgba(255, 255, 255, 0.1);box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						border-radius: 10px;"><img style="margin-top: 0rem;justify-self: center;" src="${user.imgurli}" >
					</div>
      <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
                   <div class="profile-info">
                        <h1 style="color:white;text-align:center;margin-bottom:7px;margin-top: 7px; line-height:2rem;font-size: 3rem;font-weight: bolder;">${user.Aname.Name}</h1> 
						<h2 style="color:white;text-align:center;margin-bottom:0px;line-height:2rem;font-size: 1.4rem;font-weight: bolder;"> ${user.Aname.Mname}  ${user.Aname.Surname} </h2> 
                        <h1 style="margin-top:3px;margin-bottom:0px;line-height:1rem;color: yellow;text-align: center;font-size:15px">>MODE OF STUDY:REGULAR <</h1>
                    </div>
  </div>
</div>
  <h1 style="font-size:17px;margin-top:10px;text-align:center;padding:0 0rem;">REG NUMBER</h1>
  <div class="profile-bottom" style="margin-bottom:-25px";>
      <div style="flex-direction:column;margin:-11px 0px;" class="profile-info">      
          <h1 style="Font-size:22px;text-align: center;color:black;font-weight: bolder;">- ${user.RegNo}-</h1>                               
          </div>
           <h1 style="font-size:15px;margin-top:20px;text-align:center;padding:0 0rem;">Validity</h1>
           <div style="flex-direction:column;"class="profile-info"> 
                  <h1 style="margin-top:-1.5px;font-size:19px;color:black;font-weight: bolder;">-${user.Validity}-</h1>
                
              </div> 
      </div>
      <div class="profile-bottom">
          <div style="display:flex;justify-self: center;width: 100%;">
              <div style="width:31%;margin:0 1px;">
                  <h1 style="font-size:12px;margin-top:-5px;text-align:center;padding:0 1.5rem;">B/G</h1>
                  <div class="profile-info">
                  <h2 style="color:black;padding:0 .8rem;margin-top:-5px;font-weight: bolder;justify-self: center;font-size: 18px;font-weight: bolder;background-color: transparent;border: none;text-align: center;width:6rem;">${user.Bloodgroup}</h2>
                  </div>
              </div>
              <div style="width:31%;margin:0 1px;">
              <h1 style="font-size:12px;margin-top:-5px;text-align:center;padding:0 1rem;">STATUS</h1>
                  <div style="flex-direction:column;"class="profile-info">
                  <h1 style="margin:1px 0px;color:red;font-size:15px;font-weight: bolder;">- STUÐENT-</h1>
                  </div>
              </div>
              <div style="width:31%;margin:0 1px;">
                  <h1 style="font-size:12px;margin-top:-5px;text-align:center;padding:0 1.5rem;">GENDER</h1>
                  <div class="profile-info">
                  <h2 style="color:black;padding:0 .8rem;margin-top:-5px;font-weight: bolder;justify-self: center;font-size: 18px;font-weight: bolder;background-color: transparent;border: none;text-align: center;width:6rem;" >${user.Sex}</h2>
                  </div>
              </div>
          </div>
          
          <h1 style="font-size:12px;margin-top:-8px;text-align:center;padding:0 0rem;">STATE OF ORIGIN/LGA</h1>
              <div style="flex-direction:column;"class="profile-info"> 
	            <h1 style="margin:-5px;color:red;font-size:15px;margin: 1px 0px;font-weight: bolder;border: none;text-align: center;">${user.LocalGovt}</h1>
                    <h1 style="margin-top:-1px;font-weight: bold;font-size: 20px;border: none;text-align: center;">${user.State}</h1> 
              </div> 
              
              
              <div style="display:flex;margin:-9px 0px;;justify-content:center;margin-right: 1rem;">
                  <div>
                      <h1 style="font-size:12px;margin:0px;text-align:center;">PHONE NO </h1>
                      <div class="profile-info">
                          
                              <div style="margin-left: 0px;"class="p1">	
                                  <h1 style="margin-left: 0px;font-size: 18px;border: none;text-align: center;padding: 0px 10px;font-weight: bolder;
                                  background-color: transparent;color: white;width:9rem;">Protected</h1>
                              </div>
                                           
                      </div>
                  </div>
                  <div>
                      <h1 style="font-size:12px;margin:0px;text-align:center;">EMERGENCY NO:</h1>
                      <div class="profile-info">
                          
                              <div style="margin-left: 0px;"class="p2">
                               <h1 style="margin-left: 0px;font-size: 18px;border: none;text-align: center;padding: 0px 10px;font-weight: bolder;
                                  background-color: transparent;color: white;width:9rem;">Protected</h1>
                              </div>
                                            
                      </div>                           
                  </div>
              </div>
  </div> `
      facttext.appendChild(li)

  });
}


