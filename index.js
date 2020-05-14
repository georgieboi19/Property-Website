//When the page has loaded it will load the script
$(document).ready(function() {
    //Using Jquery UI to format some elements which helps with consistancy
    $("#dateadded").datepicker({
        showButtonPanel: true,
        maxDate: 0
    });
    $("#search").button();
    $('#favourite_display').button();
    $('#clear_button').button();

    $("#type, #min_price, #max_price, #min_rooms, #max_rooms").selectmenu();

    //Function holding clear button action (interacts with local storage predefined method)
    $("#clear_button").on("click", function() {
        window.alert("About to clear");
        localStorage.clear();
    });
    //on click will start the function
    $("#favourite_display").on("click", function() {
        showFavourites();
    });

    function showFavourites() {
        //getting data from the JSON file to be able to interact with it
        $.getJSON('properties.json', function(data) {
            //using javascript to format the page depending on the function carried out
            document.getElementById('search').innerHTML = "Search Properties";
            document.getElementById('search_number').innerHTML = "";
            //display a message if there is no items to display
            var clear_message = "To add items to your favourites click add favourite on the property page";
            //retirves the local storage
            var favourite_list = JSON.parse(localStorage.getItem("favourite_properties"));
            var output_favourite = "<span id=&quot;search_type&quot;><h1>Favourites</h1></span><span><button id=clear_button>Clear Favourites</button><div id=clear></div><ul>";
            //getting local storage properties and adding them to a list to show output. For loops goes through local storage
            if (favourite_list != null || favourite_list == []) {
                for (var i = 0; i < data.properties.length; i++) {
                    for (var x = 0; x < favourite_list.length; x++) {
                        if (data.properties[i].id == favourite_list[x]) {
                            output_favourite += "<li id=prop" + [i + 1] + "><img src=" + data.properties[i].picture + "> <h2>" + data.properties[i].bedrooms + " Bedroom " + data.properties[i].type + "</h2>" + data.properties[i].description.slice(0, 100) + "...<br> <br> <b>£" +
                                data.properties[i].price.toLocaleString() + "</b><button id=remove_favourite" + i + ">Remove</button><a href=" + data.properties[i].url + ">See more</a> </li>"

                        }
                    }
                }
                output_favourite += "</ul>";
                document.getElementById('search_number').innerHTML = "";
                document.getElementById('placeholder').innerHTML = output_favourite;
                //using jqury to amend CSS depending upon function called
                $('#placeholder').css("border-style", "solid");
                $('#placeholder').css("border-color", "#ffdb58");
                var tag = $("#container");
                $('#clear_button').button();
                //individual buttons for each property
                $('#remove_favourite0').button();
                $('#remove_favourite1').button();
                $('#remove_favourite2').button();
                $('#remove_favourite3').button();
                $('#remove_favourite4').button();
                $('#remove_favourite5').button();
                $('#remove_favourite6').button();
                $('html,body').animate({
                    scrollTop: tag.offset().top
                }, 'slow');
                //using the clear function of local storage to remove the data
                $("#clear_button").on("click", function() {
                    window.alert("Clearing your Favourites");
                    localStorage.clear();
                    document.getElementById('placeholder').innerHTML = clear_message;
                    $('#placeholder').css("text-align", "center");
                });
                //on click for removing particular elements.
                $("button[id*=remove_favourite]").on("click", function() {
                    window.alert("removing your Favourites");
                    //This selects the closest list elements ID in order to remove ID from local storage
                    var remove_id = $(this).closest("li").attr("id");
                    var favourite_list = JSON.parse(localStorage.getItem("favourite_properties"));
                    for (var y = 0; y < favourite_list.length; y++) {
                        if (favourite_list[y] == remove_id) {
                            //splice will remove the element that matches the local storage (y)
                            favourite_list.splice(y);
                            localStorage.setItem('favourite_properties', JSON.stringify(favourite_list));
                            showFavourites();
                        }
                    }

                });

            } else {
                document.getElementById('placeholder').innerHTML = clear_message;
                //amending css for the element depending on the outcome of the JS
                $('#placeholder').css("border-style", "solid");
                $('#placeholder').css("border-color", "#ffdb58");
                $('#placeholder').css("text-align", "center");
                var tag = $("#container");
                //animation which will focus the viewport on the container for a smooth UI
                $('html,body').animate({
                    scrollTop: tag.offset().top
                }, 'slow');
            }
        });
    }

    $("#search").on("click", function() {
        showResult();
    });

    function showResult() {
        $.getJSON('properties.json', function(data) {
            var type = $("select#type").val();
            var min_price = $("select#min_price").val();
            var max_price = $("select#max_price").val();
            var min_rooms = $("select#min_rooms").val();
            var max_rooms = $("select#max_rooms").val();
            var date_picker = $("#dateadded").val();
            var count = 0;
            var list = "<span id=&quot;search_type&quot;><h1>Search Results</h1></span><div id=clear></div><ul>";
            //goes through all the items in the json file and goes through the if statements to make sure they match what was searched then add them to a list if they are correct
            for (var i in data.properties) {
                if (((parseInt(min_price) <= data.properties[i].price) || (min_price == "any")) && ((type == data.properties[i].type) || (type == "any")) &&
                    ((parseInt(max_price) >= data.properties[i].price) || (max_price == "any")) && ((parseInt(min_rooms) <= data.properties[i].bedrooms) || (min_rooms == "any")) &&
                    ((parseInt(max_rooms) >= data.properties[i].bedrooms) || (max_rooms == "any"))) {
                    list += "<li><img src=" + data.properties[i].picture + "> <h2>" + data.properties[i].bedrooms + " Bedroom " + data.properties[i].type + "</h2>" + data.properties[i].description.slice(0, 100) + "...<br> <br> <b>£" +
                        data.properties[i].price.toLocaleString() + "</b> <a href=" + data.properties[i].url + " rel=noopener>See more</a> </li>"
                    count++;
                }

            }
            list += "</ul>";
            var search_num
            if (count > 0) {
              //count will display how many properties have been display to aid user experience
                search_num = "<b>Showing " + count + " properties out of " + data.properties.length + "</b>";
            } else {
                search_num = "<b>No properties have been found</b>"
            }
            document.getElementById('placeholder').innerHTML = list;
            document.getElementById('search_number').innerHTML = search_num;
            $('#placeholder').css("border-style", "solid");
            $('#placeholder').css("border-color", "black");
            document.getElementById('search').innerHTML = "Update";
            $('#placeholder').css("text-align", "inherit");
            var tag = $("#container");
            $('html,body').animate({
                scrollTop: tag.offset().top
            }, 'slow');
        });
    }
    //formating elements to jquery ui
    $("#add_favourite").button();
    $("#tabs").tabs();
    $('.tumbnails a').click(function(e) {
        //prevent default is stopping the normal function
        e.preventDefault();
        $('.gallery img').attr("src", $(this).attr("href"));
    })

    $.getJSON('../properties.json', function(data) {
        //retreiving the specific data into variables that can be called later
        var details_long1 = data.properties[id].description;
        var type1 = data.properties[id].type;
        var price1 = data.properties[id].price.toLocaleString();
        var location1 = data.properties[id].location;
        var rooms1 = data.properties[id].bedrooms;
        var tenure1 = data.properties[id].tenure;

        document.getElementById('price1').innerHTML = "<h2>£" + price1 + "</h2>";
        document.getElementById('type1').innerHTML = type1;
        document.getElementById('location1').innerHTML = location1;
        document.getElementById('tabs-1').innerHTML = details_long1;
        document.getElementById('property_title1').innerHTML = "<h1>" + rooms1 + " bedroom " + type1 + " for sale</h1>";
        document.getElementById('tenure2').innerHTML = tenure1;

    });
    $("#add_favourite").on("click", function() {
        //try and catch which helps with error handling
        try {
            //selecting attributes
            $(this).attr('disabled', true);

            var add_id = $(this).closest("p").attr("id");
            var favourite_list = JSON.parse(localStorage.getItem("favourite_properties"));
            //if the favourite_list doesnt contain any array it will add one
            if (favourite_list == null) {
                favourite_list = [];
                //push is predefined to add an item to local storage
                favourite_list.push(add_id);
            } else if (favourite_list.includes(add_id)) {
              //display allert to let user know it is already in their favourites
                window.alert("This property is already in your favourite list")
            } else {
                favourite_list.push(add_id);
            }
            localStorage.setItem('favourite_properties', JSON.stringify(favourite_list));
        } catch (e) {}
    });

});
