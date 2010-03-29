require 'rubygems'
require 'json'
class GraphsController < ApplicationController
	# GET /graphs
	# GET /graphs.xml
	def index
		@graphs = Graph.find(:all)

		respond_to do |format|
			format.html # index.html.erb
			format.xml	{ render :xml => @graphs }
		end
	end

	# GET /graphs/1
	# GET /graphs/1.xml
	def show
		@graph = Graph.find(params[:id])
		render :template => "home/index", :layout => false
=begin
		respond_to do |format|
			format.html # show.html.erb
			format.xml	{ render :xml => @graph }
		end
=end
	end

	# GET /graphs/new
	# GET /graphs/new.xml
=begin
	def new
		@graph = Graph.new

		respond_to do |format|
			format.html # new.html.erb
			format.xml	{ render :xml => @graph }
		end
	end
=end

=begin
	# GET /graphs/1/edit
	def edit
		@graph = Graph.find(params[:id])
	end
=end

	# POST /graphs
	# POST /graphs.xml
	def create
		@graph = Graph.new(params[:graph])

		if @graph.save
			render :text => {:id => @graph.id, :errors => "none"}.to_json
		else
			render :text => {:errors => "couldn't save graph"}.to_json
		end
	end

	# PUT /graphs/1
	# PUT /graphs/1.xml
	def update
		@graph = Graph.find(params[:id])

		respond_to do |format|
			if @graph.update_attributes(params[:graph])
				flash[:notice] = 'Graph was successfully updated.'
				format.html { redirect_to(@graph) }
				format.xml	{ head :ok }
			else
				format.html { render :action => "edit" }
				format.xml	{ render :xml => @graph.errors, :status => :unprocessable_entity }
			end
		end
	end

	# DELETE /graphs/1
	# DELETE /graphs/1.xml
=begin
	def destroy
		@graph = Graph.find(params[:id])
		@graph.destroy

		respond_to do |format|
			format.html { redirect_to(graphs_url) }
			format.xml	{ head :ok }
		end
	end
=end

end
