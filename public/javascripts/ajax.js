function addAnItem() {
    var data = {};
    data.title = $("#title").val();
    data.url = $("#url").val();
    
    $.ajax({
        url: 'http://localhost:3000/save',
        type:'POST',
	data:JSON.stringify(data),
        contentType:'application/json',
        success: function(data) {
        	console.log(JSON.stringify(data));
		$("#catalogs").append("<div class='row margin'><div class='col-md-3'><div class='imageHolder'><img class='images' src='" +data.url+ "'></div></div><div class='col-md-9'><div class='row'>"+data.title+"</div><div class='row'><a id='"+data._id+"' style='cursor: pointer;' onclick=markAsFavorite('"+data._id+"')>Mark as favorite</a></div></div></div>");
	},
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
};

function markAsFavorite(id){
	var data = {};
	data.id = id;

	$.ajax({
		url: 'http://localhost:3000/mark',
		type:'POST',
		data:JSON.stringify(data),
		contentType:'application/json',
		success: function(data){
			$(".fav").each(function(key,value){
				var curr_id = $(this).attr("value");
				$(this).replaceWith("<a id='"+curr_id+"' style='cursor: pointer;' onclick=markAsFavorite('"+curr_id+"')>Mark as favorite</a>");
			});
			$("#"+id).replaceWith('<span value="'+id+'" class="label label-danger fav">Favorite item</span>');
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log('error ' + textStatus + " " + errorThrown);
		}

	});
};
