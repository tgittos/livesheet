require "rubygems"
require "sinatra"
require "data_mapper"

DataMapper.setup(:default, "sqlite:///#{Dir.pwd}/db/api.db")

class Character
  include DataMapper::Resource

  property :id,    Serial 
  property :apiKey,   String
  property :charData,  Text
end

Character.auto_migrate!

get "/" do
  File.read(File.join('public', 'index.html'))
end

post "/character" do
  new_char = Character.new
  new_char.apiKey = params['apiKey']
  new_char.charData = params['data']
  new_char.save
end

get "/character/:apiKey" do
  Character.first(apiKey: params['apiKey']).to_json
end
