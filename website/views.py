from flask import Blueprint, render_template, url_for

views = Blueprint("views", __name__)


@views.route('/')
def index():
    return render_template('base.html')


@views.route('/azimuth_and_elevation_angle')
def function_az():
    return render_template('azimuth_and_elevation_angle.html')

@views.route('/get_coordinates')
def function_get():
    return render_template('get_coordinates.html')

@views.route('/communication_availability')
def function_com():
    return render_template('communication_availability.html')

@views.route('/viewing_tables')
def function_view():
    return render_template('viewing_tables.html')
@views.route('/pars_TLE')
def function_parse():
    return render_template('pars_TLE.html')

@views.route('/monotonous_time_service')
def function_mon_time():
    return render_template('monotonous_time_service.html')

@views.route('/abonents')
def function_abonents():
    return render_template('abonents.html')