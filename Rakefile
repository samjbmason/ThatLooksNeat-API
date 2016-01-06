require 'rubygems'
require 'bundler'
Bundler.require

Dotenv.load
require './bin/fetch_issues'

task :fetch_issues do
  get_campaigns
end

task default: :fetch_issues