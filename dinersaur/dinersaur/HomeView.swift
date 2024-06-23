//
//  ContentView.swift
//  dinersaur
//
//  Created by kn on 6/23/24.
//

import SwiftUI
import SwiftData

struct HomeView: View {
    @State private var search = "";
    var body: some View {
        VStack(alignment: .center) {
            
            // header
            
            HStack(alignment: .center) {
                Text("Dinersaur")
                    .font(.title)
                    .padding(.leading, 15)
                Spacer()
                HStack(alignment: .center) {
                    TextField("Search", text: $search)
                        .frame(width: 220)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .fixedSize(horizontal: true, vertical: false)
                        .multilineTextAlignment(.leading)
                        .padding(.trailing, 15)
                }
            }
            Divider()
            Spacer()
            
            // body
            
            // footer
            
            Spacer()
            Divider()
            HStack(alignment: .center) {
                Button("Home", action: switchView)
            }
        }
    }
}
                    
func switchView () {
    
}

#Preview {
    HomeView()
}
