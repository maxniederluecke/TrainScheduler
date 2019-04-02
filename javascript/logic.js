
var config = {
  apiKey: "AIzaSyA-dVOvZAXclpghsMAlGVVjzeXRnOQ3GQc",
  authDomain: "trainscheduler-ca857.firebaseapp.com",
  databaseURL: "https://trainscheduler-ca857.firebaseio.com",
  projectId: "trainscheduler-ca857",
  storageBucket: "trainscheduler-ca857.appspot.com",
  messagingSenderId: "835450153271"
};
firebase.initializeApp(config);
var database = firebase.database();

var train;
var destination;
var firsttrain;
var frequency;
var firstTimeConverted;
var currentTime;
var diffTime;
var tRemainder;
var nextTrainArrival;
var tMinutesTillTrain;

function nextTrain(firstTime, tFrequency){
    // First Time (pushed back 1 year to make sure it comes before current time)
    firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("First Time Converted:"+firstTimeConverted);
    // Current Time
    currentTime = moment();
    // Difference between the times
    diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference between time:"+diffTime);
    // Time apart (remainder)
    tRemainder = diffTime % tFrequency;
    console.log("Remainder between times" +tRemainder);
    // Minute Until Train
    tMinutesTillTrain = tFrequency - tRemainder;
    console.log("Minutes til train"+tMinutesTillTrain);
    // Next Train
    nextTrainArrival = moment().add(tMinutesTillTrain, "minutes");
    nextTrainFormatted = moment(nextTrainArrival).format("hh:mm A");
    console.log("Next arrival"+nextTrainArrival);
};
// Capture Button Click
$("#submit").on("click", function(event) {
      // Don't refresh the page!
  event.preventDefault();
  // Code in the logic for storing and retrieving the most recent user.
  train = $("#train").val().trim();
  destination = $("#destination").val().trim();
  frequency =  $("#frequency").val().trim();
  firsttrain = $("#first").val().trim();
  nextTrain(firsttrain,frequency);
  var newtrain = {
      trains:train,
      destinations:destination,
      frequencies:frequency,
      firsttrains:firsttrain,
      nexttrain: nextTrainFormatted,
      minutestil: tMinutesTillTrain
  };

  database.ref().push(newtrain);

  $("#train").val("");
  $("#destination").val("");
  $("#frequency").val("");
  $("#first").val("");
});

database.ref().on("child_added", function (snapshot) {

  var removeButton = $("<button>").text("Remove");
  removeButton.addClass("remove-button btn btn-primary");
  var newRow = $("<tr>").append(
  $("<td>").text(snapshot.val().trains),
  $("<td>").text(snapshot.val().destinations),
  $("<td>").text(snapshot.val().frequencies),
  $("<td>").text(snapshot.val().nexttrain),
  $("<td>").text(snapshot.val().minutestil),
  $("<td>").append(removeButton)
  );

  newRow.attr("id", snapshot.key);

  $("#trains > tbody").append(newRow);
        
  }, function(errorObject){
    console.log("Errors handled: " + errorObject.code);
  });

  $("body").on("click", ".remove-button", function() {
  $(this).closest ('tr').remove();
    mykey = $(this).parent().parent().attr('id')
    database.ref().child(mykey).remove();
});
