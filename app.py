from website import create_app
import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5003)