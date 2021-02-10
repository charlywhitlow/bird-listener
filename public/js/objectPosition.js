
// load bird.csv

// get image_urls and css columns, for all images with 'blank' in either css col
// "image_url": "https://upload.wikimedia.org/wikipedia/commons/b/be/Apus_apus_-Barcelona%2C_Spain-8_%281%29.jpg"
// "image_css_x": 50,
// "image_css_y": 50

// add next/back buttons to loop through images

// add save button- to write back to csv any values which have been updated


// update image in page
function setImage(image_url){
    let img = document.getElementById("bird-image");
    img.setAttribute('src', image_url);
    if (img.naturalHeight > img.naturalWidth) {
        // update y
        document.getElementById("y").disabled = false;
        document.getElementById("y").style.backgroundColor = 'white';
        // disable x
        document.getElementById("x").disabled = true;
        document.getElementById("x").style.backgroundColor = 'grey';
    }else{
        // update x
        document.getElementById("x").disabled = false;
        document.getElementById("x").style.backgroundColor = 'white';
        // disable y
        document.getElementById("y").disabled = true;
        document.getElementById("y").style.backgroundColor = 'grey';
    }
}
setImage('https://upload.wikimedia.org/wikipedia/commons/b/be/Apus_apus_-Barcelona%2C_Spain-8_%281%29.jpg')


// update x and y values on page
function updateX(x){
    if(x < 0 | x > 100){
        document.getElementById('warning').style.visibility = "visible";
    }else{
        setX(x);
        document.getElementById('warning').style.visibility = "hidden";
    }
}
function updateY(y){
    if(y < 0 | y > 100){
        document.getElementById('warning').style.visibility = "visible";
    }else{
        setY(y);
        document.getElementById('warning').style.visibility = "hidden";
    }
}
function setX(x){
    let y = document.getElementById('y').value;
    document.getElementById('bird-image').style.objectPosition = `${x}% ${y}%`;
}
function setY(y){
    let x = document.getElementById('x').value;
    document.getElementById('bird-image').style.objectPosition = `${x}% ${y}%`;
}

// navigation buttons
function back(){
    console.log('back');
}
function next(){
    console.log('next');
}
function saveAndQuit(){
    console.log('saveAndQuit');
}


// image_url
// https://upload.wikimedia.org/wikipedia/commons/b/be/Apus_apus_-Barcelona%2C_Spain-8_%281%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/c/c5/Greater_Spotted_Woodpecker_%2841554059345%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/c/c5/European_green_woodpecker_%28Picus_viridis%29_female_Barnes.jpg
// https://upload.wikimedia.org/wikipedia/commons/f/ff/Eurasian_jay_YerevanBotanic2020.jpg
// https://upload.wikimedia.org/wikipedia/commons/b/bd/Periparus_ater_%2841076978671%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/f/fd/Sumpfmeise1.jpg
// https://upload.wikimedia.org/wikipedia/commons/8/86/Eurasian_blue_tit_Lancashire.jpg
// https://upload.wikimedia.org/wikipedia/commons/d/d2/Parus_major_Luc_Viatour.jpg
// https://upload.wikimedia.org/wikipedia/commons/5/50/HirundoRusticaFlight.jpg
// https://upload.wikimedia.org/wikipedia/commons/6/60/House_Martin_-_Delichon_urbicum_-_B%C3%A6jasvala.jpg
// https://upload.wikimedia.org/wikipedia/commons/0/0b/Long_tailed_Tit_on_a_washing_line_-_geograph.org.uk_-_1714032.jpg
// https://upload.wikimedia.org/wikipedia/commons/f/fe/Goldcrest_1.jpg
// https://upload.wikimedia.org/wikipedia/commons/c/c3/Eurasian_Wren_Troglodytes_troglodytes_neglectus%2C_Gilgit_%2819738387572%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/d/d5/Sitta_europaea_-Europe-8.jpg
// https://upload.wikimedia.org/wikipedia/commons/0/04/Certhia_familiaris_01.jpg
// https://upload.wikimedia.org/wikipedia/commons/0/06/Toulouse_-_Sturnus_vulgaris_-_2012-02-26_-_2.jpg
// https://upload.wikimedia.org/wikipedia/commons/a/a9/Common_Blackbird.jpg
// https://upload.wikimedia.org/wikipedia/commons/5/5d/Turdus_pilaris_no.JPG
// https://upload.wikimedia.org/wikipedia/commons/c/c1/Redwing_Turdus_iliacus.jpg
// https://upload.wikimedia.org/wikipedia/commons/b/b2/Turdus_philomelos_-_Western_Springs_Lakeside_Park.jpg
// https://upload.wikimedia.org/wikipedia/commons/9/9e/Turdus_viscivorus_in_Baikonur-town_001.jpg
// https://upload.wikimedia.org/wikipedia/commons/f/f3/Erithacus_rubecula_with_cocked_head.jpg
// https://upload.wikimedia.org/wikipedia/commons/d/dc/House_Sparrow%28Passer_domesticus%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/0/0b/Prunella_modularis-crop.jpg
// https://upload.wikimedia.org/wikipedia/commons/4/45/Fringilla_coelebs_on_branch.jpg
// https://upload.wikimedia.org/wikipedia/commons/c/c9/Fringilla_montifringilla_-Poland_-male-8.jpg
// https://upload.wikimedia.org/wikipedia/commons/d/de/Bullfinch_male.jpg
// https://upload.wikimedia.org/wikipedia/commons/2/29/Chloris_chloris_%28profile%29.jpg
// https://upload.wikimedia.org/wikipedia/commons/7/7c/Carduelis_carduelis_close_up.jpg
// https://upload.wikimedia.org/wikipedia/commons/9/9e/Carduelis_spinus_male.jpg
