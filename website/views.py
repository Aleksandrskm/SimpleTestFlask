from flask import Blueprint, render_template, url_for

views = Blueprint("views", __name__)


@views.route('/')
def index():
    return render_template('base.html')


@views.route('/azimuth_and_elevation_angle')
def function_az():
    return render_template('azimuth_and_elevation_angle.html')


@views.route('/finding_coordinates')
def function_find():
    return render_template('finding_coordinates.html')


@views.route('/get_coordinates')
def function_get():
    return render_template('get_coordinates.html')

@views.route('/communication_availability')
def function_com():
    return render_template('communication_availability.html')
