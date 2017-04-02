class BrushSpaceLivestream extends BrushSpace {
    mid_constructor(description) {
        this.visualType = "Livestream";

        // Check for WebRTC
        if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
            alert('WebRTC is not available in your browser.');
        }
        this.roomName = "wonderland";
        this.activeRoom = undefined;
    }
    attachTracks(tracks, container) {
      tracks.forEach(function(track) {
        container.appendChild(track.attach());
      });
    }

    attachParticipantTracks(participant, container) {
      var tracks = Array.from(participant.tracks.values());
      this.attachTracks(tracks, container);
    }

    detachTracks(tracks) {
      tracks.forEach(function(track) {
        track.detach().forEach(function(detachedElement) {
          detachedElement.remove();
        });
      });
    }

    detachParticipantTracks(participant) {
      var tracks = Array.from(participant.tracks.values());
      this.detachTracks(tracks);
    }
    roomJoined(room) {
        var that = this;
      that.activeRoom = room;

      that.log("Joined as '" + this.identity + "'");

      room.participants.forEach(function(participant) {
        that.log("Already in Room: '" + participant.identity + "'");
        var previewContainer = document.getElementById('remote-media');
        that.attachParticipantTracks(participant, previewContainer);
      });

      // When a participant joins, draw their video on screen
      room.on('participantConnected', function(participant) {
        that.log("Joining: '" + participant.identity + "'");
      });

      room.on('trackAdded', function(track, participant) {
        that.log(participant.identity + " added track: " + track.kind);
        var previewContainer = document.getElementById('remote-media');
        that.attachTracks([track], previewContainer);
      });

      room.on('trackRemoved', function(track, participant) {
        that.log(participant.identity + " removed track: " + track.kind);
        that.detachTracks([track]);
      });

      // When a participant disconnects, note in log
      room.on('participantDisconnected', function(participant) {
        that.log("Participant '" + participant.identity + "' left the room");
        that.detachParticipantTracks(participant);
      });

      // When we are disconnected, stop capturing local video
      // Also remove media for all remote participants
      room.on('disconnected', function() {
        that.log('Left');
        that.detachParticipantTracks(room.localParticipant);
        room.participants.forEach(that.detachParticipantTracks);
        this.activeRoom = null;
        // document.getElementById('button-join').style.display = 'inline';
        // document.getElementById('button-leave').style.display = 'none';
      });
    }
    create_or_update_data_items() {
        var that = this;
        var dataItems = this.vis_el.append("div").attr("id", "remote-media");

        window.addEventListener('beforeunload', this.leaveRoomIfJoined);

        $.getJSON('https://haip-twilio.glitch.me/token', function(data) {
            that.identity = data.identity;

            that.log("Joining room '" + that.roomName + "'...");

            var connectOptions = { name: that.roomName, logLevel: 'debug' };

            console.log(that.roomJoined);

            Twilio.Video.connect(data.token, connectOptions).then(function(room) {
                that.roomJoined(room);
            }, function(error) {
                that.log('Could not connect to Twilio: ' + error.message);
            });
        });
    }
    log(message) {
    //   var logDiv = document.getElementById('log');
    //   logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
    //   logDiv.scrollTop = logDiv.scrollHeight;
      console.log(message);
    }
    leaveRoomIfJoined() {
      if (this.activeRoom) {
        this.activeRoom.disconnect();
      }
    }
    create_scene() {
        var that = this;

        this.container_el = this.parent.append("div")
            .attr("class", "bs-el-container bs-el-container--"+this.id);

        this.create_scene_label();

        this.el = this.container_el.append("div")
            .attr("class", "bs-el bs-el--"+this.id)
            .style("width", this.container_width+"px")
            .style("height", this.container_height+"px");
        this.vis_el = this.el.append("div").attr("class", "cover bs-el-vis bs-el-vis--textual-log bs-el-vis--"+this.id);

        this.create_or_update_data_items();

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        this.htmlOverlayContainer = this.el.append("div")
            .attr("class", "html-overlay-container cover-position");

        that.create_resize_control();
    }
    update_scene() {
        var that = this;

        this.el.style("width", this.container_width+"px")
            .style("height", this.container_height+"px");

        this.width = this.container_width - this.margin.left - this.margin.right,
        this.height = this.container_height - this.margin.top - this.margin.bottom;

        // this.create_or_update_data_items();  TODO

        this.update_annotations();
    }
    update_annotations() {
        // TODO
    }
    resize(width, height) {
        this.container_width = width;
        this.container_height = height;
        this.update_scene();
    }
    mousemove(e) {
        return;
    }
    clicked(clickPosition) {
        // TODO
    }
    state_change(e) {
        this.state = e.state;
        // TODO
    }
    update_domain(newDomain) {
        return;
    }
    get_brush_selection() {
        return {domain: undefined};
    }
    brush_change(e) {
        return;
    }
}
