### Weather dashboard

The purpose of this website is to provide a responsive web application that displays up-to-date weather conditions for a chosen location via the <a href="https://developer.accuweather.com/home">AccuWeather</a> API.

#### Features:
+ Today's forecast section displaying the current weather conditions.
+ Week's forecast section displaying the upcoming 5-day weather conditions.
+ List of popular cities for quick access.
+ Settings panel to modify how the information is displayed.
+ On page refresh, the application automatically shows the last searched city.

#### Performance:
In order to improve performance, the application uses `localStorage` to cache all the data retrieved from the API, up to 30 minutes, in order to reduce network requests and avoid exceed the API request limit.

#### Additional information:
+ The API key is hard-coded for testing and development purposes and represents the Free Tier of <a href="https://developer.accuweather.com/home">AccuWeather</a>.
+ The search function only activates after the user stops typing and has entered at least 3 characters.

