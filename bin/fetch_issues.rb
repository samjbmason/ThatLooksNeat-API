MC_DC = ENV['MAILCHIMP_DC']
MC_API_KEY = ENV['MAILCHIMP_API_KEY']
GH_USERNAME = ENV['GITHUB_USERNAME']
GH_SECRET = ENV['GITHUB_SECRET']
GH_REPO = ENV['GITHUB_REPO']
GH_DATA_FILE = ENV['GITHUB_DATA_FILE']

# Get campign data from mailchimp
# Hash contents to Base64
# Go to Github and look for file
# If it is 404 then create the file using the hashed file
# ELSE Get the current files hash and compare it
# IF they are identical stop ELSE update file with new file

def get_campaigns
  params = {
    type: 'regular',
    status: 'sent',
    fields: 'campaigns.archive_url,campaigns.send_time',
    count: 2000
  }
  campaign_endpoint = "https://#{MC_DC}.api.mailchimp.com/3.0/campaigns"

  mc_response = HTTP.basic_auth(user: 'anything', pass: MC_API_KEY).get(campaign_endpoint, params: params)

  puts 'Campaigns received from Mailchimp'

  mc_response = JSON.parse(mc_response)

  mc_body_hash = Base64.encode64(JSON.pretty_generate(mc_response))

  file = file_exists

  if file
    update_or_ignore_file(mc_body_hash, file)
  else
    create_file(mc_body_hash)
  end
end

def file_exists
  gh_file_endpoint = "https://api.github.com/repos/#{GH_USERNAME}/#{GH_REPO}/contents/#{GH_DATA_FILE}"
  params = {json: { branch: 'gh-pages' }}
  file = HTTP.basic_auth(user: GH_USERNAME, pass: GH_SECRET).get(gh_file_endpoint, params)

  file unless file.code == 404
end


def create_file(contents)
  file_endpoint = "https://api.github.com/repos/#{GH_USERNAME}/#{GH_REPO}/contents/#{GH_DATA_FILE}"
  params = {json: {
    message: "Getting campigns from mailchimp ",
    content: contents,
    branch: 'gh-pages'
  }}
  HTTP.basic_auth(user: GH_USERNAME, pass: GH_SECRET).put(file_endpoint, params)
  puts 'No file found creating one now!'
end

def update_or_ignore_file(new_file, current_file)
  puts 'File exists, checking if any difference between current and new info'

  current_file_json = JSON.parse(current_file)

  if new_file != current_file_json['content']
    file_endpoint = "https://api.github.com/repos/#{GH_USERNAME}/#{GH_REPO}/contents/#{GH_DATA_FILE}"
    params = {json: {
      message: "Updating campaigns from Mailchimp on #{Date.today.strftime('%d/%m/%Y')}",
      content: new_file,
      branch: 'gh-pages',
      sha: current_file_json['sha']
    }}
    HTTP.basic_auth(user: GH_USERNAME, pass: GH_SECRET).put(file_endpoint, params)
    puts 'New info from Mailchimp, updating GitHub repo now'
  end
end