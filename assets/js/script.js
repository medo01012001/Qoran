const apiurl ='https://mp3quran.net/api/v3';
const long ='ar';

async function getreciters(){
    const choosereciters = document.querySelector('#choosereciters')
    const res =await fetch(`${apiurl}/reciters?Languge=${long}`)
    const data =await res.json()
    choosereciters.innerHTML = `<option value="">اختر قارئ</option>`
    data.reciters.forEach(reciters => choosereciters.innerHTML += `<option value="${reciters.id}">${reciters.name}</option>`);

    choosereciters.addEventListener('change',(e)=> getMoshaf(e.target.value))
}
getreciters()

async function getMoshaf(reciter){
    const chooseMoshaf = document.querySelector('#chooseMoshaf')

    const res =await fetch(`${apiurl}/reciters?Languge=${long}&reciter=${reciter}`)
    const data =await res.json()
    const moshafs = data.reciters[0].moshaf
    chooseMoshaf.innerHTML = `<option value="" data-server="" data-surahList="">اختر رواية</option>`

    moshafs.forEach(moshaf =>{ 
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-surahList="${moshaf.surah_list}">${moshaf.name}</option>`
    });


   
  chooseMoshaf.addEventListener('change',(e)=>{
         const selectedMoshaf=chooseMoshaf.options[chooseMoshaf.selectedIndex]
          const surahserver = selectedMoshaf.dataset.server;
          const surahlist = selectedMoshaf.dataset.surahlist;

          getSurah(surahserver,surahlist)
  })


}
async function getSurah(surahserver,surahlist){

    const chooseSurah = document.querySelector('#chooseSurah')

    const res =await fetch(`https://mp3quran.net/api/v3/suwar`)
    const data =await res.json()
    const surahnames = data.suwar;

    surahlist = surahlist.split(',')
    chooseSurah.innerHTML += `<option value="">اختر سورة</option>`

    surahlist.forEach(surah=>{ 
        const padsurah = surah.padStart(3,'0')
        surahnames.forEach(surahname =>{
            if (surahname.id == surah){
                chooseSurah.innerHTML += `<option value="${surahserver}${padsurah}.mp3">${surahname.name}</option>`
            }
        } )
    })

    chooseSurah.addEventListener('change',(e)=>{
        const selectedsurah=chooseSurah.options[chooseSurah.selectedIndex]
        playSurah(selectedsurah.value)

    })
}

function playSurah(surahMp3){
       const audioPlayer = document.querySelector('#audioPlayer')
       audioPlayer.src=surahMp3;
       audioPlayer.play();
  
}

function playLive(channel){
    if(Hls.isSupported()) {
        var video = document.getElementById('livevideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
}