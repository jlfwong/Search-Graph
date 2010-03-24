require 'open-uri'
require 'cgi'
require 'rubygems'
require 'json'
require 'hpricot'
require 'rexml/document'

class SearchController < ApplicationController
  def google_web
  	method = params['method']

	query = params['q']
	if (method == "api")
	  # The Search API is yielding innacurate results for estimated result count - as a result, going to screen scrap
		result = JSON.parse(open("http://ajax.googleapis.com/ajax/services/search/web?v=1.0&safe=off&filter=1&q=" + CGI::escape(query)).read)
		numResults = result['responseData']['cursor']['estimatedResultCount']
		if numResults == nil
			numResults = 0
		end
		@response = {
			:query      => query,
			:numResults => numResults.to_i,
			:iterator   => params['it'],
			:error      => "none"
		}.to_json
	elsif (method == "scrape")
		baseurl = "http://www.google.com/search?q="
		#baseurl = "http://translate.googleusercontent.com/translate_c?sl=en&tl=fr&u=http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D"
		url = baseurl + CGI::escape(query)

		begin
			httpresponse = open(baseurl + CGI::escape(query)).read

			rescue OpenURI::HTTPError
				# Google is captcha'ing
				@response = {
					:error => "Google is blocking requests (requesting captcha). Try using the API version instead.",
				}.to_json
				return 0
		end

		doc = Hpricot(httpresponse)

		if (doc/"p#resultStats"/"b").length > 2
			numResults = (doc/"p#resultStats"/"b")[2].inner_html.gsub(",","").to_i
		else
			numResults = 0
		end

		@response = {
			:query      => query,
			:numResults => numResults,
			:iterator   => params['it'],
			:error      => "none",
		}.to_json
	else
		@response = {
			:error => "Unknown Method: " + method
		}.to_json
	end
  end
end
