    // Make connection
    var socket = io.connect('http://localhost:4000');
    
    // Query DOM
    var message = document.getElementById('message'),
        handle = document.getElementById('handle'),
        btn = document.getElementById('send'),
        output = document.getElementById('output'),
        feedback = document.getElementById('feedback'),
        userlist = document.getElementById('userlist'),
        btn2 = document.getElementById('logout_btn'),
        btn3 = document.getElementById('submit');
    
    $("#chat").hide();
    $("#logout").hide();
    $("#userlistheader").hide();
    $("#userlist").hide();
    $("#error").hide();

    // Emit events
    var addToTime = 5000;
    if (socket.connect()) {
        setInterval(function(){ 
            addToTime -= 1000;
            console.log(addToTime);
            if(addToTime == 0) {
                socket.disconnect();
                $("#userlistheader").hide();
                $("#userlist").hide();
                $("#error").hide();
                $("#chat").hide();
                $("#logout").hide();
                $("#login").show();
                socket.connect();
            }
        }, addToTime);
    }; 


    message.addEventListener('keypress', function(){
        socket.emit('typing');
        addToTime += 5000;
    });

    btn2.addEventListener('click', function(){
        socket.disconnect();
        $("#userlistheader").hide();
        $("#userlist").hide();
        $("#error").hide();
        $("#chat").hide();
        $("#logout").hide();
		$("#login").show();
        socket.connect();
    });


    btn3.addEventListener('click', function(){
        socket.emit('new_username', handle.value, function(data){
            if(data){
                $("#login").hide();
                $("#chat").show();
                $("#logout").show();
                $("#userlistheader").show();
                $("#userlist").show();
                socket.connect();
            } else {
                $("#error").show();
            }
        });
        handle.value = "";
    });

    btn.addEventListener('click', function(){
        socket.emit('chat', message.value);
        message.value = "";
    });

    // Listen for events
    socket.on('chat', function(data){
        feedback.innerHTML = '';
        output.innerHTML += '<p><strong>' + data.user + ': </strong>' + data.message + '</p>';
    });
    
    socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em><img src="https://data.whicdn.com/images/123819875/original.gif" width="42" height="42"></p>';
    });

    socket.on('usernames', function(data){
        var html = '';
        for (i = 0; i < data.length; i++){
            html += data[i] + '<br/>';
        }
        userlist.innerHTML = html;
    });