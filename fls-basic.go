package main

import (
	"log"
	"net/http"
)

func RouteRoot(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/static/fls.html", http.StatusSeeOther)
}

func main() {
	fs := http.FileServer(http.Dir("src"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	// http.Handle("/static/", fs)
	http.HandleFunc("/", RouteRoot)

	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)
}
