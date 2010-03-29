require 'rubygems'
require 'htmlentities'

class HomeController < ApplicationController
  def index
  	@graph = Graph.find(:first, :order => "random()")
	coder = HTMLEntities.new
	@graph.query_template = coder.encode(@graph.query_template)
  end
end
