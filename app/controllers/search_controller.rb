require 'open-uri'
require 'cgi'
require 'rubygems'
require 'json'
require 'hpricot'
require 'rexml/document'

class SearchController < ApplicationController
  def google_web
  	query = params['q']
  # The Search API is yielding innacurate results for estimated result count - as a result, going to screen scrap
=begin
	result = JSON.parse(open("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&filter=1&q=" + CGI::escape(query)).read)
	numResults = result['responseData']['cursor']['estimatedResultCount']
	if numResults == nil
		numResults = 0
	end
	@response = {
		:query      => query,
		:numResults => numResults,
		:iterator   => params['it']
		#:data       => result
	}.to_json
=end
	doc = Hpricot(open("http://www.google.ca/search?q=" + CGI::escape(query)))

	if (doc/"p#resultStats"/"b").length > 2
		numResults = (doc/"p#resultStats"/"b")[2].inner_html.gsub(",","").to_i
	else
		numResults = 0
	end

	@response = {
		:query      => query,
		:numResults => numResults,
		:iterator   => params['it']
	}.to_json
  end
end
