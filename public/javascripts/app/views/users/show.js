CATARSE.UsersShowView = Backbone.View.extend({

	initialize: function() {
		_.bindAll(this, "index", "backs", "projects", "credits", "comments", "request_refund")
		CATARSE.router.route("", "index", this.index)
		CATARSE.router.route("backs", "backs", this.backs)
		CATARSE.router.route("projects", "projects", this.projects)
		CATARSE.router.route("credits", "credits", this.credits)
		CATARSE.router.route("comments", "comments", this.comments)
		CATARSE.router.route("request_refund/:back_id", "request_refund", this.request_refund)
		this.render()
	},

  user: new CATARSE.User($('#user_profile').data("user")),

  BackView: CATARSE.ModelView.extend({
    template: _.template(this.$('#user_back_template').html())
  }),

  BacksView: CATARSE.PaginatedView.extend({
  	emptyTemplate: _.template(this.$('#empty_user_back_template').html()),
		afterUpdate: function() {
			FB.XFBML.parse()
		}
  }),

  ProjectView: CATARSE.ModelView.extend({
    template: _.template(this.$('#user_project_template').html())
  }),
  
  ProjectsView: CATARSE.PaginatedView.extend({
  	emptyTemplate: _.template(this.$('#empty_user_project_template').html()),
		afterUpdate: function() {
			FB.XFBML.parse()
		}
  }),

	index: function() {
		this.backs()
    CATARSE.router.navigate("backs")
	},

	backs: function() {
		this.selectItem("backed_projects")
		this.backsView = new this.BacksView({
			modelView: this.BackView,
			collection: this.user.backs,
			loading: this.$("#loading"),
			el: this.$("#user_backed_projects")
		})
	},

	projects: function() {
		this.selectItem("created_projects")
		this.projectsView = new this.ProjectsView({
			modelView: this.ProjectView,
			collection: this.user.projects,
			loading: this.$("#loading"),
			el: this.$("#user_created_projects")
		})
	},

	credits: function() {
		this.selectItem("credits")
	},

	comments: function() {
		this.selectItem("comments")
	},

	request_refund: function(back_id) {
		url = '/users/'+this.user.id+'/request_refund/'+back_id;
		$.post(url, function(result) {
			alert(result['status'])
			$("tr#back_"+back_id+" td.status").text(result['status'])
		})
	},

	selectItem: function(item) {
		this.$("#user_profile_content .content").hide()
		this.$("#user_profile_content #user_" + item + ".content").show()
		var link = this.$("#user_profile_menu #" + item + "_link")
		link.parent().children().removeClass('selected')
    link.addClass('selected')
	}

})

$('input,textarea').live('keypress', function(e){
  if (e.which == '13' && $("button:contains('OK')").attr('disabled')) {
    e.preventDefault();
  }
})

$('#user_feed input').live('keyup', function(){
  var value = $(this).val()
  var re = /^[a-z0-9\._-]+@([a-z0-9][a-z0-9-_]*[a-z0-9-_]\.)+([a-z-_]+\.)?([a-z-_]+)$/
  if(value.match(re)){
    $(this).addClass("ok").removeClass("error")
    $("button:contains('OK')").attr('disabled', false)
  } else {
    $(this).addClass("error").removeClass("ok")
    $("button:contains('OK')").attr('disabled', true)
  }
})

$('#content_header textarea').live('keyup', function(){
  var value = $(this).val()
  if(value.length <= 140){
    $(this).addClass("ok").removeClass("error")
    $("button:contains('OK')").attr('disabled', false)
  } else {
    $(this).addClass("error").removeClass("ok")
    $("button:contains('OK')").attr('disabled', true)
  }
})

$('input[type=checkbox]').click(function(){
  $.post('/users/update_attribute_on_the_spot', {
    id: 'user__' + $(this).attr('id') + '__' + $('#id').val(),
    value: ($(this).is(':checked') ? 1 : null)
  })
})