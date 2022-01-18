// GLOBAL VARIABLES
// In production we should not expose API keys, this is just for practice
const appKey = "519dc64cad7fc5d0edaeb1b7a18ee033";
const appID = "dd60f915";

const calIntakeNeeds = {
    "Female": {
        "4-8": {
            "Sedentary": 1200,
            "Moderately Active": 1500,
            "Active": 1600
        },
        "9-13": {
            "Sedentary": 1600,
            "Moderately Active": 1800,
            "Active": 2000
        },
        "14-18": {
            "Sedentary": 1800,
            "Moderately Active": 2000,
            "Active": 2400
        },
        "19-30": {
            "Sedentary": 2000,
            "Moderately Active": 2100,
            "Active": 2400
        },
        "31-50": {
            "Sedentary": 1800,
            "Moderately Active": 2000,
            "Active": 2200
        },
        "51+": {
            "Sedentary": 1600,
            "Moderately Active": 1800,
            "Active": 2100
        }
    },
    "Male": {
        "4-8": {
            "Sedentary": 1400,
            "Moderately Active": 1500,
            "Active": 1800
        },
        "9-13": {
            "Sedentary": 1800,
            "Moderately Active": 2000,
            "Active": 2300
        },
        "14-18": {
            "Sedentary": 2200,
            "Moderately Active": 2600,
            "Active": 3000
        },
        "19-30": {
            "Sedentary": 2400,
            "Moderately Active": 2700,
            "Active": 3000
        },
        "31-50": {
            "Sedentary": 2200,
            "Moderately Active": 2500,
            "Active": 2900
        },
        "51+": {
            "Sedentary": 2000,
            "Moderately Active": 2300,
            "Active": 2600
        }
    }
}
