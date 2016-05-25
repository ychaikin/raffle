(function () {

angular.module("raffle", []);
angular.module("raffle")

.controller('WinnerController',
            ['$scope', '$http', '$interval',
function($scope, $http, $interval) {
  var winnerController = this;

  winnerController.recommendationWinners = [];
  winnerController.grandPrizeWinnerAnnouncement = "";
  winnerController.onTimeRegisteredStudents = [];

  var beforeDate = new Date("2016-04-05");
  var studentRegisteredOnTimeFilter = function (student) {
    return new Date(student.CONFIRM_TIME) <= beforeDate;
  };

  // Checks if the student is already in winnersArray (by email address)
  var isInWinnersArray = function (student, winnersArray) {
    var found = winnersArray.find(function (winnerStudent) {
      return student["Email Address"] === winnerStudent["Email Address"];
    });

    if (found) {
      return true;
    }
    else {
      return false;
    }
  };

  // Random student, but NOT part of the winners array yet
  var getRandomStudent = function (studentArray, winnersArray) {
    var foundWinner = false;
    var studentWinner = null;
    var min = 0;
    var max = studentArray.length;
    while (!foundWinner) {
      var studentIndex = Math.floor(Math.random() * (max - min)) + min;

      // Test if already in winnersArray
      if (!isInWinnersArray(studentArray[studentIndex], winnersArray)) {
        studentWinner = studentArray[studentIndex];
        foundWinner = true;
      }
    }

    return studentWinner;
  };


  // Pick Recommendation Winners
  winnerController.getRecommendationWinners = function () {
    var dataUrl = "/data/students.json";
    // var dataUrl = "/data/realdata.json"; 

    $http({
      url: dataUrl,
      method: "GET"
    })
    .then(
      function (result) {
        var students = result.data;
        winnerController.onTimeRegisteredStudents =
          students.filter(studentRegisteredOnTimeFilter);
        $interval(function () {
          var studentWinner =
              getRandomStudent(winnerController.onTimeRegisteredStudents,
                               winnerController.recommendationWinners);
          winnerController.recommendationWinners.push(studentWinner);
          console.log("Recommendation winner: ",
                      studentWinner["First Name"] +
                      " " +
                      studentWinner["Last Name"] +
                      " " +
                      studentWinner["Email Address"] +
                      " registered at " +
                      studentWinner.CONFIRM_TIME);
          }, 700, 10);
      },
      function (error) {
        console.log("Error");
      }
    );
  };


  // Pick Grand Prize Winner
  winnerController.getGrandPrizeWinner = function () {
    // var dataUrl = "/data/students.json";
    var dataUrl = "/data/realdata.json";

    $http({
      url: dataUrl,
      method: "GET"
    })
    .then(
      function (result) {
        var students = result.data;
        winnerController.onTimeRegisteredStudents =
          students.filter(studentRegisteredOnTimeFilter);
        var studentWinner =
          getRandomStudent(winnerController.onTimeRegisteredStudents,
                           winnerController.recommendationWinners);
        console.log("Grand Prize Winner: ",
                    studentWinner["First Name"] +
                    " " +
                    studentWinner["Last Name"] +
                    " " +
                    studentWinner["Email Address"] +
                    " registered at " +
                    studentWinner.CONFIRM_TIME +
                    " from region: " +
                    studentWinner.REGION +
                    " from CC: " +
                    studentWinner.CC);
        var winnerAnnouncementArray = ["GRAND", "Prize", "Winner", "IS:",
                                      studentWinner["First Name"],
                                      studentWinner["Last Name"]
                                      ];
        var i = 0;
        $interval(function () {
          winnerController.grandPrizeWinnerAnnouncement +=
            winnerAnnouncementArray[i++] + " ";
        }, 700, winnerAnnouncementArray.length);

      },
      function (error) {
        console.log("Error");
      }
    );
  };


}]); // WinnerController end

})(); // IIFE end
