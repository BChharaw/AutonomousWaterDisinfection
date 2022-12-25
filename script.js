
function setUVCCproperties (experimentalBulbOutput, theoreticalBulbOutput, lampBulbRadius, lampBulbLength, systemRadius, bulbCasingRadius, returnObjectIfTrue) {
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
    let standardConfiguration = setUVCCproperties(1, 9000, 1.15,17, 5.08,1.37, true);
    let stdConfigWithEcoli = disinfection(standardConfiguration, 6, true);
    console.log(standardConfiguration);
    console.log(stdConfigWithEcoli);
    alert(document.getElementById('contaminant').value);
  }
function showValue(value) {
  document.getElementById("sliderValue").innerHTML = value;
}