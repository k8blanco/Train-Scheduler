 //Train Scheduler
 
 
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDkpVF4sBkimGwbNzERyuco3lQeMC3zkjk",
    authDomain: "trainscheduler-48365.firebaseapp.com",
    databaseURL: "https://trainscheduler-48365.firebaseio.com",
    projectId: "trainscheduler-48365",
    storageBucket: "",
    messagingSenderId: "347821263908"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//Initialize Parallax
  $(document).ready(function(){
    $('.parallax').parallax();
    });

//Initialize Floating Action Button
    $(document).ready(function(){
        $('.fixed-action-btn').floatingActionButton();
      });
            

  //"Add Train" Button Click Event
  $("#addTrainBtn").on("click", function(event) {
      event.preventDefault();

      //Get user input
      var trainName = $("#trainNameInput").val().trim();
      var newDestination = $("#destinationInput").val().trim();
      var firstTime = $("#firstTimeInput").val().trim();
      var newFrequency = $("#frequencyInput").val().trim();
      

      //Temp object for new train data
      var newTrain = {
          name: trainName,
          destination: newDestination,
          frequency: newFrequency,
          trainStart: firstTime,
          whenAdded: firebase.database.ServerValue.TIMESTAMP
      };

    //Pushes new train data to database
    database.ref().push(newTrain);

    //Logs to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.frequency);
    console.log(newTrain.trainStart);
    console.log(newTrain.whenAdded);

    // alert("New Train Added!");
    M.toast({html: 'New train added!', classes:'rounded white-text black lighten-1',});

    //Clears text boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTimeInput").val("");
    $("#frequencyInput").val("");

});

//Firebase to add new train to database & row in html on user input
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    //Store new data in a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().trainStart;

    //New train info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFrequency);
    console.log(firstTime);

    //get current time 
    var currentTime = moment();
        console.log("CURRENT TIME:" + moment(currentTime).format("HH:mm a"));

    //clock
    $("#clock").text(currentTime.format("hh:mm a"));

    //convert first time !!change to military time
    var firstTimeConverted = moment(firstTime, "HH:mm a").subtract(1, "years");
        console.log(firstTimeConverted);

    //calculate difference between times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime)

    //time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
        console.log("Remainder: " + tRemainder);

    //calculate minutes until next train
    var minutesAway = trainFrequency - tRemainder;
        console.log("MINUTES TILL NEXT TRAIN: " + minutesAway);


    //determine next train 
    var nextTrain = moment().add(minutesAway, "minutes").format("HH:mm a");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm a"));


    //Create new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway),
    );

    //Append new row to schedule
    $("#currentSchedule > tbody").append(newRow);
});





