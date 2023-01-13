
function setUVCCproperties (experimentalBulbOutput, theoreticalBulbOutput, lampBulbRadius, lampBulbLength, systemRadius, returnObjectIfTrue, bulbCasingPadding = 0.22) {
  //unless specified padding is 0.22 cm
  console.log(experimentalBulbOutput, theoreticalBulbOutput, lampBulbRadius, lampBulbLength, systemRadius, returnObjectIfTrue, bulbCasingPadding);
  const bulbCasingRadius = parseFloat(bulbCasingPadding) + parseFloat(lampBulbRadius);
	const distanceBetweenBulbAndWall = systemRadius - bulbCasingRadius;
	const incidentRayIntensityAtEdge = Math.exp(-0.0024*distanceBetweenBulbAndWall);
	const bulbSurfaceArea = ((2*Math.PI*lampBulbRadius*lampBulbLength) + (2*Math.PI*Math.pow(lampBulbRadius,2))); //Surface area in cm^2
	const experimentalBulbOutputMW = experimentalBulbOutput;
	const bulbEfficiency = (experimentalBulbOutputMW/theoreticalBulbOutput);
	const quantifiableBulbOutput = experimentalBulbOutput*incidentRayIntensityAtEdge; //in mJ/cm^2 per second or mW/cm^2 (equivalent )
	const crossSectionalAreaPopulatedByBulb = Math.PI*Math.pow(bulbCasingRadius,2);
	const crossSectionalAreaOfSystem = Math.PI*Math.pow(systemRadius,2);
	const usablecrossSectionalArea = crossSectionalAreaOfSystem - crossSectionalAreaPopulatedByBulb;

	if (returnObjectIfTrue) {
		return {
			experimentalBulbOutput: experimentalBulbOutput, //Units: mW/cm^2 (Calculated experimentally)
			theoreticalBulbOutput: theoreticalBulbOutput, //Units: mW (Stated by bulb manufacturer)
			lampBulbRadius: lampBulbRadius, //Units: cm
			lampBulbLength: lampBulbLength, //Units: cm
			bulbSurfaceArea: bulbSurfaceArea,
			experimentalBulbOutputMW: experimentalBulbOutputMW,
			bulbEfficiency: bulbEfficiency,
			quantifiableBulbOutput: quantifiableBulbOutput, //in mJ/cm^2 per second or mW/cm^2 (equivalent )
			systemRadius: systemRadius, //Units: cm
			bulbCasingRadius: bulbCasingRadius,
			crossSectionalAreaPopulatedByBulb: crossSectionalAreaPopulatedByBulb,
			crossSectionalAreaOfSystem: crossSectionalAreaOfSystem,
			usablecrossSectionalArea: usablecrossSectionalArea,
			incidentRayIntensityAtEdge: incidentRayIntensityAtEdge
		};
	} else {
		return 1;
	}
}

function disinfection (UVCCproperties, logDisinfection, returnObjectIfTrueOrLPerMinIfFalse) {
	const exposureDuration = logDisinfection / (UVCCproperties.quantifiableBulbOutput);
	const speedLimit = (UVCCproperties.lampBulbLength / exposureDuration);
	const systemVolumePerSecond = UVCCproperties.crossSectionalAreaOfSystem * speedLimit;
	const bulbSpaceOccupiedPerSecond = UVCCproperties.crossSectionalAreaPopulatedByBulb * speedLimit;
	const disinfectionVolumePerSecond = systemVolumePerSecond - bulbSpaceOccupiedPerSecond;
	const lPerMinute = (disinfectionVolumePerSecond / 1000) * 60;
	const lPerHour = lPerMinute * 60;
	const lPerDay = lPerHour * 24;
	if (returnObjectIfTrueOrLPerMinIfFalse) {
		return {
			exposureDuration:logDisinfection/UVCCproperties.quantifiableBulbOutput,
			speedLimit:(UVCCproperties.lampBulbLength/exposureDuration),
			systemVolumePerSecond:UVCCproperties.crossSectionalAreaOfSystem * speedLimit,
			bulbSpaceOccupiedPerSecond:UVCCproperties.crossSectionalAreaPopulatedByBulb * speedLimit,
			disinfectionVolumePerSecond:systemVolumePerSecond - bulbSpaceOccupiedPerSecond,
			lPerMinute:(disinfectionVolumePerSecond / 1000)*60,
			lPerHour:lPerMinute*60,
			lPerDay:lPerHour*24
		};
	} else {
		return lPerMinute;
	}
}


function run ()
  {
    /*The code for the fluid analysis is presented as we used it for the project to aid is 
    designing, the code presented in this website is simply a demonstration so features are 
    simplified and the full entend of the fluid analysis is not demonstrated.*/

    const bulbSurfaceArea = ((2*Math.PI*document.getElementById("bulbradius").innerHTML*document.getElementById("length").innerHTML) + (2*Math.PI*Math.pow(document.getElementById("bulbradius").innerHTML,2))); 
    let configuration = setUVCCproperties(
      (document.getElementById("theo-bulb-output").innerHTML * document.getElementById("bulb-efficiency").innerHTML/(100*bulbSurfaceArea)), 
      document.getElementById("theo-bulb-output").innerHTML,
      document.getElementById("bulbradius").innerHTML,
      document.getElementById("length").innerHTML,                   
      document.getElementById("radius").innerHTML,
      true);
    let configWithEcoli = disinfection(configuration, document.getElementById("pathogen").innerHTML,false);
    document.getElementById("result").innerHTML = Math.round(configWithEcoli * 100) / 100;
	document.getElementById("result2").innerHTML = 24*60*Math.round(configWithEcoli * 100) / 100;
  }

function showValue(value, id) {
  document.getElementById(id).innerHTML = value;
  run();
}


  function expandCollapse(id) {
    let previd = id;
    id = id + "*";
    let field = document.getElementById(id);
    if (field.style.display === "none") {
      field.style.display = "block";
      document.getElementById(previd).innerHTML = "Less info (collapse)";
    } else {
      field.style.display = "none";
      document.getElementById(previd).innerHTML = "More info (expand)";
    }
  }

function changeGallery(isForwards, isFirstGallery) {
  if (isFirstGallery)
  {
  let image = document.getElementById("image-gallery1");
  let imgSources = ["petri-dish-plain-backing.png","petri-dish-text-backing.png","uncontaminated-petri-dishes.png"];
        let captions = ["Petri dishes swabbed with Lake Ontario water. Dish on left used the lake water processed through the UVCC.",
                        "To demonstrate the clarity of the petri dishes we also put them on top of a paper with text.",
                        "Uncontaminated agar which was used, shown to demonstrate the natural colour of the agar."];
        let curIMG = parseInt(image.alt);
        let button = document.getElementById("next-button");
        if (isForwards)
        {
        curIMG = (curIMG + 1) % imgSources.length;
        document.getElementById("gallery1-caption").innerHTML = captions[curIMG];
        image.src = imgSources[curIMG];
        image.alt = curIMG.toString();
        }
        else 
        {
          if (curIMG-1 == -1)
            curIMG = imgSources.length-1;
          else 
            curIMG--;
          
        }
        document.getElementById("gallery1-caption").innerHTML = captions[curIMG];
        image.src = imgSources[curIMG];
        image.alt = curIMG.toString();
  }
  else
  {
      let image = document.getElementById("image-gallery2");
  let imgSources = ["body-shell-2.jpg","body-shell.jpg","flowing-water.jpg", "outer-prototype.jpg", "uv-light-on.jpg", "in-tank.jpg"];
        let captions = [" ", " ", " ", " ", " ", " "];
        let curIMG = parseInt(image.alt);
        let button = document.getElementById("next-button");
        if (isForwards)
        {
        curIMG = (curIMG + 1) % imgSources.length;
        document.getElementById("gallery2-caption").innerHTML = captions[curIMG];
        image.src = imgSources[curIMG];
        image.alt = curIMG.toString();
        }
        else 
        {
          if (curIMG-1 == -1)
            curIMG = imgSources.length-1;
          else 
            curIMG--;
          
        }
        document.getElementById("gallery2-caption").innerHTML = captions[curIMG];
        image.src = imgSources[curIMG];
        image.alt = curIMG.toString();
  }
}